import { z } from "zod";

export const StudentSchema = z.object({
	admissionNo: z
		.string()
		.min(10)
		.regex(/^CA-\d{2}\/\d{2}-\d+$/),
	institutionName: z.string().min(1),
	name: z.string().min(1),
	stream: z.string().min(1),
	fees: z.number().min(0),
	phoneNo1: z.string().min(10).max(10),
	phoneNo2: z.string().min(10).max(10).optional(),
	subjects: z
		.array(z.string())
		.min(1, { message: "At least one subject must be selected." })
		.default([]),
	admissionDate: z.date().default(new Date()),
	studyIn: z.enum(["school", "college"]).default("school"),
	profilePicture: z.instanceof(File).optional().nullable(),
});
