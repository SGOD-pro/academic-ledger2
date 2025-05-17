import connectDb from "@/db";
import ApiResponse from "@/lib/ResponseHelper";
import Batches from "@/models/Batches";
import examModel from "@/models/Exam";
import mongoose from "mongoose";

function formatDate(date: Date): string {
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
	const year = date.getFullYear();
	return `${day}/${month}/${year}`;
}

export async function POST(req: Request) {
	await connectDb();

	try {
		const data = await req.json();

		// Use Promise.all to run both async operations concurrently
		const [created, batch] = await Promise.all([
			examModel.create({
				description: data.description,
				batch: data.batch,
				fullMarks: data.fullMarks,
				date: data.date,
			}),
			Batches.aggregate([
				{
					$match: { _id: new mongoose.Types.ObjectId(data.batch) },
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
					$addFields: {
						time: {
							$concat: ["$startTimeFormatted", " - ", "$endTimeFormatted"],
						},
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
				{
					$project: {
						_id: 0,
						batch: {
							$concat: ["$time", " - ", "$days"],
						},
						subject: 1,
					},
				},
			]),
		]);

		if (!created || !created._id) {
			return ApiResponse.error("Failed to create the exam", 500);
		}

		// Prepare response data
		const resData: ExamsInterface = {
			_id: created._id.toString(),
			description: created.description,
			batch: batch[0]?.batch ?? "",
			fullMarks: created.fullMarks,
			date: formatDate(created.date),
			subject: batch[0].subject,
		};

		// Return success response
		return ApiResponse.success(resData, 200);
	} catch (error: any) {
		console.log(error);
		return ApiResponse.error(error.message, 500);
	}
}

export async function GET(_: Request) {
	connectDb();

	try {
		const data = await examModel.aggregate([
			{
				// Lookup to join the Exam's batch with the Batches collection
				$lookup: {
					from: "batches", // name of the batches collection
					localField: "batch",
					foreignField: "_id",
					as: "batchInfo",
				},
			},
			{
				// Unwind the batchInfo array to simplify the structure
				$unwind: "$batchInfo",
			},
			{
				// Add fields for formatting time and days
				$addFields: {
					startTimeFormatted: {
						$dateToString: {
							format: "%H:%M",
							date: "$batchInfo.startTime",
						},
					},
					endTimeFormatted: {
						$dateToString: {
							format: "%H:%M",
							date: "$batchInfo.endTime",
						},
					},
					// Convert array of days to a comma-separated string
					days: {
						$reduce: {
							input: "$batchInfo.days",
							initialValue: "",
							in: {
								$concat: ["$$value", ", ", "$$this"],
							},
						},
					},
				},
			},
			{
				// Create a concatenated time string and adjust the days field
				$addFields: {
					time: {
						$concat: ["$startTimeFormatted", " - ", "$endTimeFormatted"],
					},
					days: {
						$cond: {
							if: { $eq: ["$days", ""] },
							then: "",
							else: {
								$substrCP: [
									"$days",
									2,
									{ $subtract: [{ $strLenCP: "$days" }, 2] },
								],
							},
						},
					},
				},
			},
			{
				// Project the final structure of the output
				$project: {
					_id: 1,
					description: 1,
					fullMarks: 1,
					date: {
						$dateToString: {
							format: "%d/%m/%Y",
							date: "$date",
						},
					},
					batch: {
						$concat: ["$time", " - ", "$days"],
					},
					subject: "$batchInfo.subject",
				},
			},
		]);
		return ApiResponse.success(data, 200);
	} catch (error: any) {
		console.log(error);
		return ApiResponse.error(error.message, 500);
	}
}
