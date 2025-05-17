import studentModel from "@/models/StudentModel";
import db from "@/db";

export async function GET() {
	await db();
	try {
		const students = await studentModel.find({}).sort({ _id: -1 }).limit(1);
		if (!students) {
			return Response.json({ error: "No students found" }, { status: 404 });
		}
		return Response.json({ admissionNo: students[0].admissionNo, success: true }, { status: 200 });
	} catch (error) {
		return Response.json({ error: error as Error,success: false }, { status: 500 });
	}
}
