"use client";
import ApiService from "@/lib/ApiService";

const apiService = new ApiService("/api/assignment/curd");
export default async function FormSubmit(data: any): Promise<boolean> {
	const res = await apiService.post("", data,true);
	return res.success;
}
