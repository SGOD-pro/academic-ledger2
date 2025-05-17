import userModel from "@/models/StudentModel";
import { NextResponse, NextRequest } from "next/server";
import { capitalizeWords } from "@/helper/Capitalize";
import ConnectDB from "@/db";
import formDataToJson from "@/helper/FormData";
import uploadImage from "@/helper/UploadFirebase";
import ApiResponse from "@/lib/ResponseHelper";

const jsonObject = (data: any): StudentDetailsInterface => {
	const object: StudentDetailsInterface = {
		name: capitalizeWords(data.name),
		phoneNo1: data["phoneNo1"],
		phoneNo2: data["phoneNo2"],
		subjects: data["subjects[]"],
		institutionName: data["institutionName"],
		admissionNo: data["admissionNo"],
		studyIn: data["studyIn"],
		stream: data["stream"],
		fees: parseFloat(data["fees"] || 0),
		admissionDate: data["admissionDate"],
	};
	return object;
};

export async function POST(req: NextRequest) {
	await ConnectDB();
	try {
		const data = await req.formData();
		const file = data.get("profilePicture") as File | null;
		const jsonData = formDataToJson(data);
		const object = jsonObject(jsonData);
		const exists = await userModel.findOne({
			admissionNo: object.admissionNo,
		});
		const { name, admissionNo, stream, institutionName } = object;
		if (
			[name, admissionNo, stream, institutionName].some(
				(value) => value?.trim() === ""
			)
		) {
			return ApiResponse.error("Some attributes are missing", 400);
		}

		if (exists) {
			return ApiResponse.error(
				`Already admission no assigned to ${exists.name}`,
				409
			);
		}
		if (file) {
			const { fileURL, error } = await uploadImage(file, "profilePicture");
			if (!error) {
				object.profilePicture = fileURL;
			}
		}

		const student = await userModel.create(object);
		const response = {
			...student.toJSON(),
			subjects: student?.subjects?.join(","),
		};
		const message =
			file && !student.profilePicture
				? "Student add but image not uploaded."
				: "Student added successfully";
		return ApiResponse.success(response, 200, message);
	} catch (error: any) {
		console.log(error);

		return ApiResponse.error(error.message || "Something went wrong", 500);
	}
}

export async function GET() {
	await ConnectDB();
	try {
		const users = await userModel.aggregate([
			{
				$sort: { _id: -1 },
			},
			{
				$limit: 4,
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
		]);
		return ApiResponse.success(users, 200, "Fetched students...");
	} catch (error: any) {
		console.log(error);
		return ApiResponse.error(error.message || "Something went wrong", 500);
	}
}

export async function DELETE(req: NextRequest) {
	await ConnectDB();
	try {
		const url = new URL(req.url);
		const _id = url.searchParams.get("id");
		console.log(_id);
		const deleted = await userModel.findByIdAndDelete(_id);
		if (!deleted) {
			const error: any = new Error("Could not find");
			error.status = 404;
			throw error;
		}
		return ApiResponse.success(deleted._id, 200, "Deleted");
	} catch (error: any) {
		console.log(error);
		return ApiResponse.error(error.message || "Something went wrong", 500);
	}
}

export async function PUT(req: Request) {
	await ConnectDB();
	try {
		const url = new URL(req.url);
		const _id = url.searchParams.get("id");
		if (!_id) {
			return ApiResponse.error("Id not found", 401);
		}
		const data = await req.formData();
		const jsonData = formDataToJson(data);
		const object = jsonObject(jsonData);
		const { name, admissionNo, stream, institutionName } = object;
		if (
			[name, admissionNo, stream, institutionName].some(
				(value) => value?.trim() === ""
			)
		) {
			return ApiResponse.error("Some attributes are missing", 400);
		}

		const userExists = await userModel.find({
			$or: [{ _id }, { admissionNo }],
		});
		if (userExists.length === 0 || userExists.length > 1) {
			return ApiResponse.error(
				userExists.length > 1
					? "Duplicate admissionNo found."
					: "User not found ",
				400
			);
		}
		const file = data.get("profilePicture") as File | null;

		if (file) {
			const { fileURL, error } = await uploadImage(file, "profilePicture");
			if (!error) {
				object.profilePicture = fileURL;
			}
		}
		const user = await userModel.findByIdAndUpdate(
			_id,
			{
				$set: object,
			},
			{ new: true, runValidators: true }
		);

		if (!user) {
			throw new Error();
		}
		const response = {
			...user.toJSON(),
			subjects: user?.subjects?.join(","),
		};
		const message = object.profilePicture
			? "Student added successfully"
			: file && !object.profilePicture
			? "Student add but image not uploaded."
			: "Some other condition.";
		return NextResponse.json(
			{
				message,
				data: response,
				success: file && !object.profilePicture ? false : true,
			},
			{ status: 200 }
		);
	} catch (error:any) {
		console.log(error);
		return ApiResponse.error(error.message || "Something went wrong", 500);
	}
}
