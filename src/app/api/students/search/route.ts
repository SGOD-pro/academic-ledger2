import connectDb from "@/db";
import ApiResponse from "@/lib/ResponseHelper";
import studentModel from "@/models/StudentModel";

export async function GET(req: Request) {
	await connectDb();
	try {
		const url = new URL(req.url);
		const name = url.searchParams.get("name");
		const subject = url.searchParams.get("subject");
		const admissionNo = url.searchParams.get("admissionNo");
		console.log(name, decodeURI(subject||""), admissionNo);
		let query: { $and?: any[] } | { admissionNo?: string } = {};

		if (admissionNo && admissionNo.trim()) {
			// Direct exact match for admissionNo
			query = { admissionNo: decodeURI(admissionNo) };
		} else {
			const conditions: any[] = [];

			if (name && name.trim()) {
				conditions.push({ name: { $regex: name, $options: "i" } });
			}

			if (subject && subject.trim()) {
				conditions.push({
					subjects: {
						$elemMatch: { $regex: decodeURI(subject), $options: "i" },
					},
				});
			}

			if (conditions.length > 0) {
				query = { $and: conditions };
			}
		}

		if (
			!("admissionNo" in query) &&
			(!("$and" in query) || query.$and?.length === 0)
		) {
			return ApiResponse.error("No search parameters provided", 400);
		}
		const students = await studentModel.aggregate([
			{
				$match: query, // Direct match for admissionNo or use broader $and conditions
			},
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
			{
				$sort: { _id: -1 },
			},
		]);
		console.log(students);
		return ApiResponse.success(students, 200);
	} catch (error: any) {
		return ApiResponse.error(error.message, 500);
	}
}
