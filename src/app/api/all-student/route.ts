import connectDb from "@/db";
import ApiResponse from "@/lib/ResponseHelper";
import studentModel from "@/models/StudentModel";

export async function GET(req: Request) {
	await connectDb();
	try {
		const url = new URL(req.url);
		// const page = url.searchParams.get("page") as string;
		// const subject = url.searchParams.get("subject") as string;
		// const batch = url.searchParams.get("batch") as string;
		const response = await studentModel.aggregate([
			{
				$match: {
					$or: [
						{ batches: { $exists: true, $size: 0 } },
						{ batches: { $exists: false } },
					],
				},
			},
			{ $sort: { _id: -1 } },
			{
				$addFields: {
					subjects: {
						$reduce: {
							input: "$subjects",
							initialValue: "",
							in: { $concat: ["$$value", ",", "$$this"] },
						},
					},
				},
			},
			{
				$addFields: {
					subjects: {
						$substrCP: [
							"$subjects",
							1,
							{ $subtract: [{ $strLenCP: "$subjects" }, 1] },
						],
					},
				},
			},
			{
				$project: {
					name: 1,
					admissionNo: 1,
					subjects: 1,
					profilePicture: 1,
				},
			},
		]);
		// console.log(response);
		return ApiResponse.success(response, 200, "Fetched not assigned batches.");
	} catch (error: any) {
		console.log(error);
		
		return ApiResponse.error(error.message, 500);
	}
}
