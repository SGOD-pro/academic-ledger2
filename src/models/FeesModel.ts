import mongoose, { Schema, Document, ObjectId } from "mongoose";
import studentModel from "./StudentModel";

interface FeesInterface extends Document {
	studentId: ObjectId;
	paidMonth: Date;
	paidDate:Date;
	createdAt: Date;
	updatedAt: Date;
}

const feesSchama: Schema<FeesInterface> = new Schema(
	{
		studentId: Schema.Types.ObjectId,
		paidMonth: Date,
		paidDate:Date,
	},
	{ timestamps: true }
);

const feesModel =
	(mongoose.models.fees as mongoose.Model<FeesInterface>) ||
	mongoose.model<FeesInterface>("fees", feesSchama);

export default feesModel;
