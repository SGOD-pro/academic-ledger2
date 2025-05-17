import ConnectDB from "@/db";
import { NextRequest, NextResponse } from "next/server";
import batcheModel from "@/models/Batches";
import {extractTime} from "@/helper/DateTime"
import ApiResponse from "@/lib/ResponseHelper";

export async function GET(req: NextRequest) {
	await ConnectDB();
	try {
		const url = new URL(req.url);
		const day: string | null = url.searchParams.get("day");
		const currentTime = new Date();
		
		const newTime=extractTime(currentTime.toISOString())
		console.log(newTime);
		
		const nextBatch = await batcheModel.aggregate([
			{
				$match: {
					days: day,
					startTime: { $gte: newTime },
				},
			},
			{
				$sort: { startTime: 1 },
			},
			{
				$limit: 1,
			},
			{
				$project:{days:0}
			}
		]);
		console.log(nextBatch)
		return ApiResponse.success(nextBatch[0], 200);
		
	} catch (error:any) {
		return ApiResponse.error(error.message, 500);

	}
}
