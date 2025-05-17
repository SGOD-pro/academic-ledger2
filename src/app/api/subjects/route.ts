import { NextResponse, NextRequest } from "next/server";
import ConnectDB from "@/db";
import subjectModel from "@/models/Subjects";
import { capitalizeWords } from "@/helper/Capitalize";
import ApiResponse from "@/lib/ResponseHelper";

export async function POST(req: NextRequest) {
	await ConnectDB();
	try {
		let reqBody = await req.json();
		for (const key in reqBody) {
			reqBody[key] = capitalizeWords(reqBody[key]);
		}
		const { subject } = reqBody;
		if (!subject || subject.trim() === "") {
			throw new Error("Invalid subject");
		}
		console.log(subject);

		const createdSub = await subjectModel.create({ subject });

		return NextResponse.json({
			message: "Added successfully",
			data: createdSub,
			status: true,
		});
	} catch (error: any) {
		return NextResponse.json({
			message: error.message,
			status: 500,
		});
	}
}
export async function GET(req: NextRequest) {
	await ConnectDB();
	try {
		const allSubjects = await subjectModel.find();
		return ApiResponse.success(allSubjects, 200);
	} catch (error: any) {
		return ApiResponse.error(error.message, 500);

	}
}

export async function DELETE(req: NextRequest) {
	await ConnectDB();
	try {
		const url = new URL(req.url);
		const id = url.searchParams.get("id");

		if (!id) {
			return NextResponse.json(
				{
					message: "Invalid id",
					success: false,
				},
				{ status: 401 }
			);
		}
		const deleted = await subjectModel.findByIdAndDelete(id);
		if (!deleted) {
			return NextResponse.json(
				{
					message: "Invalid id",
					success: false,	
				},
				{ status: 409 }
			);
			
		}
		return NextResponse.json({
			message: "Deleted successfully",
			deleted,
			status: true,
		});
	} catch (error: any) {
		return NextResponse.json({
			message: error.message,
			status: 500,
		});
	}
}
