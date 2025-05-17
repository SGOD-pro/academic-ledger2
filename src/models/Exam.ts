import mongoose, { Document, ObjectId, Schema } from "mongoose";


export interface ExamInterface extends Document {
	description: string;
	batch: string|ObjectId;
	date: Date;
	fullMarks: number;
}

const examSchema: Schema<ExamInterface> = new Schema({
	description: {
		type: String,
		required: true,
	},
	batch: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "batches",
	},
	fullMarks: {
		type: Number,
		required: true,
		default: 0,
	},
	date: {
		type: Date,
        required:true,
	},
});

const examModel=(mongoose.models.exams as mongoose.Model<ExamInterface>)||mongoose.model<ExamInterface>("exams", examSchema);
export default examModel;