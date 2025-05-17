import ConnectDB from "@/db";
import ApiResponse from "@/lib/ResponseHelper";
import studentModel from "@/models/StudentModel";
import mongoose from "mongoose";

export async function POST(req: Request) {
	await ConnectDB();
	try {
		console.log("post");
		const body = await req.json();
		if (!Array.isArray(body)) {
			return ApiResponse.error("Method not allowed", 405);
		}
		const batchIds = body.map(
			(batchId: string) => new mongoose.Types.ObjectId(batchId)
		);

		const url = new URL(req.url);
		const id = url.searchParams.get("id");

		if (!id) {
			throw new Error("Id not found");
		}

		const user = await studentModel.findById(id);
		if (!user) {
			return Response.json(
				{ success: false, message: "user not found" },
				{ status: 404 }
			);
		}
		user.batches = batchIds;
		await user.save();
		return Response.json(
			{ success: true, message: "Batches saved" },
			{ status: 200 }
		);
	} catch (error) {
		console.log(error);

		return Response.json(
			{ success: false, message: "Server error cann't save batches." },
			{ status: 500 }
		);
	}
}
interface Batch {
	subject: string;
	_id: mongoose.Types.ObjectId;
	subjectIdString: string;
}

interface Response {
	batch: Batch[];
}
export async function GET(req: Request) {
	await ConnectDB();

	const url = new URL(req.url);
	const id = url.searchParams.get("id");
	if (!id) {
		return Response.json(
			{ success: false, message: "Student not found." },
			{ status: 404 }
		);
	}
	try {
		await ConnectDB();
		console.log("get batches", id);

		const response: Response[] = await studentModel.aggregate([
			{ $match: { _id: new mongoose.Types.ObjectId(id) } },
			{
				$unwind: "$batches",
			},
			{
				$addFields: {
					batches: {
						$toObjectId: "$batches",
					},
				},
			},
			{
				$lookup: {
					from: "batches",
					localField: "batches",
					foreignField: "_id",
					as: "batch",
					pipeline: [
						{
							$project: {
								_id: 1,
								subject: 1,
							},
						},
						{
							$addFields: {
								subjectIdString: {
									$concat: ["$subject", ":", { $toString: "$_id" }],
								},
							},
						},
						{
							$project: {
								subjectIdString: 1,
								_id: 0,
							},
						},
					],
				},
			},
			{
				$addFields: {
					batch: { $first: "$batch" },
				},
			},
			{
				$group: {
					_id: "$_id",
					batch: { $push: "$batch" },
				},
			},
		]);
		if (!response || response.length==0) {
			return Response.json(
				{ success: false, data:null },
				{ status: 200 }
			);
		}
		console.log(response[0].batch);
		interface SubjectObject {
			[key: string]: any;
		}

		const subjectObject: SubjectObject = response[0].batch.reduce<SubjectObject>((acc, item) => {
			const [subject, id] = item.subjectIdString.split(':');
			acc[subject] = id;
			return acc;
		  }, {});

		if (response.length === 0) {
			return Response.json({ success: false }, { status: 201 });
		}
		return Response.json(
			{ success: true, message: "Batches found", data: subjectObject },
			{ status: 200 }
		);
	} catch (error) {
		console.log(error);
		return Response.json(
			{
				success: false,
				message: "Cann't get student batch details.Server error!",
			},
			{ status: 500 }
		);
	}
}
