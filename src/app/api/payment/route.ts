import connectDb from "@/db";
import feesModel from "@/models/FeesModel";
import studentModel from "@/models/StudentModel";
import { getMonthName, getNextMonth } from "@/helper/DateTime";
import mongoose from "mongoose";
import ApiResponse from "@/lib/ResponseHelper";

//Get all due payments
export async function GET(req: Request) {
	await connectDb();
	try {
		const data = await studentModel.aggregate([
			{
				$addFields: {
					admissionDate: {
						$cond: {
							if: { $eq: [{ $type: "$admissionDate" }, "string"] },
							then: { $toDate: "$admissionDate" },
							else: "$admissionDate",
						},
					},
				},
			},
			{
				$match: {
					admissionDate: {
						$lt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
					},
					$or: [
						{ lastPaid: { $exists: false } },
						{ lastPaid: null },
						{
							lastPaid: {
								$lt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
							},
						},
					],
				},
			},
			{ $sort: { _id: 1 } },
			{
				$project: {
					_id: 1,
					admissionDate: {
						$dateToString: {
							format: "%d/%m/%Y",
							date: "$admissionDate",
						},
					},
					lastPaid: {
						$cond: {
							if: { $not: ["$lastPaid"] }, // Check if lastPaid is null or not exists
							then: null,
							else: {
								$dateToString: {
									format: "%d/%m/%Y",
									date: "$lastPaid",
								},
							},
						},
					},
					name: 1,
					admissionNo: 1,
					profilePicture: 1,
					fees: 1,
				},
			},
		]);
		return Response.json(
			{
				message: "Success",
				success: true,
				data,
			},
			{ status: 200 }
		);
	} catch (error: any) {
		console.log(error);

		return Response.json(
			{
				message: error.message || "Connot get the fees record",
				success: false,
			},
			{ status: 500 }
		);
	}
}

//Set new payment
export async function POST(req: Request) {
	await connectDb();
	try {
		const url = new URL(req.url);
		const _id = url.searchParams.get("id");
		const { name, admissionNo, currentDate, amount, noOfMonths } =
			await req.json();

		if (!_id) {
			return Response.json({ message: "Cannot get id" }, { status: 403 });
		}
		const std = await studentModel.findById(_id);
		if (!std || !std._id) {
			return Response.json({ message: "Cannot get student" }, { status: 404 });
		}
		let lastPaid = std.lastPaid
			? getNextMonth(std.lastPaid)
			: std.admissionDate
			? new Date(std.admissionDate)
			: new Date();
		const paidFeesArray = [];
		console.log(lastPaid);
		let month = parseInt(noOfMonths);
		for (let i = 0; i < month; i++) {
			paidFeesArray.push({
				studentId: std._id,
				paidMonth: lastPaid,
				paidDate: currentDate,
			});
			lastPaid = getNextMonth(lastPaid);
		}
		await feesModel.insertMany(paidFeesArray);
		std.lastPaid = paidFeesArray[paidFeesArray.length - 1].paidMonth;
		await std.save();

		return Response.json(
			{
				message:
					month === 1
						? `${getMonthName(lastPaid)} Payment successfully recorded`
						: "Payments successfully recorded",
			},
			{ status: 201 }
		);
	} catch (error: any) {
		console.log(error);

		return Response.json(
			{ message: error.message || "Payment unsuccessful", success: false },
			{ status: 500 }
		);
	}
}
