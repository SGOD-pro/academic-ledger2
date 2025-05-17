import mongoose, { Schema, Document, Types } from "mongoose";

interface Presentbatch extends Document {
	batchId: Types.ObjectId;
	presents: number;
}

export interface StudentSchemaInterface extends Document {
	name: string;
	institutionName: string;
	phoneNo1: string;
	phoneNo2?: string;
	profilePicture?: string;
	subjects: string[];
	batches: Types.ObjectId[];
	presentByBatch: Presentbatch[];
	lastPaid?: Date;
	admissionNo: string;
	studyIn: string;
	stream: string;
	fees: number;
	admissionDate?: Date;
}

const StudentSchema: Schema<StudentSchemaInterface> = new Schema({
	name: {
		type: String,
		required: [true, "Name is required"],
	},
	institutionName: {
		type: String,
		required: [true, "Institution name is required"],
	},
	phoneNo1: {
		type: String,
		required: [true, "At least one phone number is required"],
	},
	phoneNo2: {
		type: String,
		default: null,
	},
	profilePicture: {
		type: String,
	},
	subjects: {
		type: [String],
		required: [true, "At least one subject is required"],
	},
	batches: {
		type: [Schema.Types.ObjectId],
		ref: "batches",
		default: [],
	},
	presentByBatch: [
		{
			batchId: { type: Schema.Types.ObjectId, ref: "batches" },
			presents: { type: Number, default: 0 },
		},
	],
	lastPaid: {
		type: Date,
		default: null,
	},
	admissionNo: {
		type: String,
		required: [true, "Admission number is required"],
	},
	studyIn: {
		type: String,
		required: [true, "Study in is required"],
	},
	stream: {
		type: String,
		required: [true, "Stream is required"],
	},
	fees: {
		type: Number,
		required: [true, "Fees is required"],
		default: 0,
	},
	admissionDate: {
		type: Date,
		default: new Date(),
	},
});

StudentSchema.pre("save", function (next) {
	console.log("save middleware triggered");

	const student = this as StudentSchemaInterface;

	if (!student.isModified("batches")) {
		console.log("No modifications to 'batches', skipping middleware");
		return next();
	}

	console.log("Modifications detected in batches");

	const presentByBatchMap = new Map(
		student.presentByBatch.map((pb) => [pb.batchId.toString(), pb])
	);
	let arr:any = [];
	student.batches.forEach((batchId) => {
		const batchIdString = batchId.toString();
		if (!presentByBatchMap.has(batchIdString)) {
			const obj = {
				batchId: new mongoose.Types.ObjectId(batchIdString),
				presents: 0,
			};
			arr.push(obj);
		}
	});
	student.presentByBatch = arr;
	console.log("Updated presentByBatch", student.presentByBatch);
	next();
});


import Attendence from "./Attendence";
import FeesModel from "./FeesModel";
StudentSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
    const deletedStudent = this as StudentSchemaInterface;
    try {
        await Promise.all([
            FeesModel.deleteMany({ studentId: deletedStudent._id }),
            Attendence.updateMany(
                { studentsId: deletedStudent._id },
                { $pull: { studentsId: deletedStudent._id } } 
            ),
        ]);
        console.log("Related feesRecords deleted and student removed from attendance records");
    } catch (error) {
        console.log("Error while removing related attendances:", error);
    }
    next();
});

const studentModel =
	(mongoose.models.students as mongoose.Model<StudentSchemaInterface>) ||
	mongoose.model<StudentSchemaInterface>("students", StudentSchema);

export default studentModel;
