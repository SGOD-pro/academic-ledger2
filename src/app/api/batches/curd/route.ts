import { NextResponse, NextRequest } from "next/server";
import ConnectDB from "@/db";
import batchModel from "@/models/Batches";
import { extractTime } from "@/helper/DateTime";
import ApiResponse from "@/lib/ResponseHelper";

export async function GET(_: NextRequest) {
	await ConnectDB();
	try {
		const allBatches = await batchModel.aggregate([
			{
				$sort: { subject: 1 },
			},
			{
				$addFields: {
					startTimeFormatted: {
						$dateToString: {
							format: "%H:%M",
							date: "$startTime",
						},
					},
					endTimeFormatted: {
						$dateToString: {
							format: "%H:%M",
							date: "$endTime",
						},
					},

					days: {
						$reduce: {
							input: "$days",
							initialValue: "",
							in: { $concat: ["$$value", ", ", "$$this"] },
						},
					},
				},
			},
			{
				$project: {
					_id: 1,
					time: {
						$concat: ["$startTimeFormatted", " - ", "$endTimeFormatted"],
					},
					subject: 1,
					days: {
						$cond: {
							if: { $eq: ["$days", ""] },
							then: "",
							else: {
								$substrCP: [
									"$days",
									2,
									{ $subtract: [{ $strLenCP: "$days" }, 1] },
								],
							},
						},
					},
				},
			},
		]);

		return ApiResponse.success<BatchInterface[]>(
			allBatches,
			200,
			"Fetched successfully"
		);
	} catch (error: any) {
		return ApiResponse.error(error.message, 500);
	}
}

export async function POST(req: NextRequest) {
	await ConnectDB();
	try {
		const { subject, endTime, startTime, days } = await req.json();
		if (!subject || !startTime || !endTime || !days) {
			return ApiResponse.error("Missing required fields", 400);
		}
		const sTime = extractTime(startTime);
		const exists = await batchModel.aggregate([
			{ $unwind: "$days" },
			{
				$addFields: {
					timeOnly: { $dateToString: { format: "%H:%M", date: "$startTime" } },
				},
			},
			{
				$match: {
					days: { $in: days },
					subject: subject,
					timeOnly: { $eq: sTime },
				},
			},
		]);

		if (exists.length > 0) {
			return ApiResponse.error("Already exists", 409);
		}
		const data = await batchModel.create({
			subject: subject,
			startTime,
			endTime,
			days,
		});

		const modifiedData = {
			_id: data._id,
			subject: data.subject,
			time: extractTime(data.startTime) + " - " + extractTime(data.endTime),
			days: data.days?.join(","),
		};
		return ApiResponse.success(modifiedData, 200, "Updated successfully");
	} catch (error: any) {
		console.log(error);
		return ApiResponse.error(error.message, 500);
	}
}

export async function DELETE(req: NextRequest) {
	await ConnectDB();
	try {
		const url = new URL(req.url);
		const _id = url.searchParams.get("id");
		if (!_id) {
			return Response.json(
				{ message: "Invalid id", success: "false" },
				{ status: 404 }
			);
		}
		const batch = await batchModel.findById(_id);
		if (!batch) {
			const error: any = new Error("Could not find");
			error.status = 404;
			throw error;
		}
		await batch.deleteOne();
		return NextResponse.json({ message: "Deleted", _id, status: true });
	} catch (error: any) {
		console.log(error);
		return NextResponse.json(
			{ error: error.message, status: false },
			{ status: 500 }
		);
	}
}

export async function PUT(req: NextRequest) {
	await ConnectDB();
	try {
		const { subject, endTime, startTime, days } = await req.json();
		const hasNullOrUndefined = [subject, startTime, endTime, days].some(
			(value) => !value
		);

		if (hasNullOrUndefined) {
			return ApiResponse.error("Missing required fields", 400);
		}
		const url = new URL(req.url);
		const _id = url.searchParams.get("id");
		const data = await batchModel.findByIdAndUpdate(
			_id,
			{
				$set: {
					subject: subject.name,
					startTime: startTime,
					endTime: endTime,
					days,
				},
			},
			{ new: true }
		);
		if (!data) {
			return ApiResponse.error("Cannot get the batch", 404);
		}
		const modifiedData = {
			_id: data._id,
			subject: data.subject,
			time: extractTime(data.startTime) + " - " + extractTime(data.endTime),
			days: data.days?.join(","),
		};
		return ApiResponse.success(modifiedData, 200, "Updated successfully");
	} catch (error: any) {
		console.log(error);
		return ApiResponse.error(error.message, 500);
	}
}