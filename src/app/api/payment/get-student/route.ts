import connectDb from "@/db";
import ApiResponse from "@/lib/ResponseHelper";
import feesModel from "@/models/FeesModel";
import studentModel from "@/models/StudentModel";
import { profile } from "console";
import mongoose from "mongoose";

//Get payment record of a spesific student
export async function GET(req: Request) {
	await connectDb();
	try {
		const url = new URL(req.url);
		const id = url.searchParams.get("id");
		if (!id) {
			return Response.json({ message: "Cannot get id" }, { status: 400 });
		}
		const student = await studentModel
			.findOne({ _id: id })
			.select(
				"-institutionName -phoneNo1 -phoneNo2 -subjects -batches -presentByBatch  -studyIn -stream"
			);

		if (!student) {
			return Response.json({ message: "Cannot get student" }, { status: 404 });
		}
		const feesRecords = await feesModel.aggregate([
			{ $match: { studentId: student._id } },
			{
				$project: {
					_id: 0,
					studentId: 1,
					paidMonth: {
						$dateToString: { format: "%Y-%m-%d", date: "$paidMonth" },
					},
					paidDate: {
						$dateToString: { format: "%Y-%m-%d", date: "$paidDate" },
					},
				},
			},
			{ $sort: { paidDate: 1 } },
		]);

		return ApiResponse.success({ feesRecords, student }, 200);
	} catch (error: any) {
		console.log(error);
		return ApiResponse.error(error.message, 500);
	}
}
