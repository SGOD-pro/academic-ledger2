"use client";
import React, { useEffect, useState } from "react";
import { notFound, useSearchParams } from "next/navigation";
import ApiService from "@/lib/ApiService";
const apiService = new ApiService("/api/students");
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import DialogComp from "@/components/Dialogcomp";
import AssignBatch from "@/components/forms/AssignBatch";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Loader from "@/components/layout/Loader";
import AssignBatchTable from "@/components/Tables/AssignBatchTable";
import NoData from "@/components/layout/NoData";

function page({ params }: { params: { slug: string } }) {
	const [data, setData] = useState<StudentData[]>([]);
	const [error, setError] = useState(false);
	const [disable, setDisable] = useState(false);
	const [loading, setLoading] = useState(false);
	if (error) {
		notFound();
	}
	const searchParams = useSearchParams();
	const nameFromUrl = searchParams.get("name") || "";
	const subjectFromUrl = searchParams.get("subject") || "";
	useEffect(() => {
		let url = "";
		if (nameFromUrl) {
			url += "name=" + nameFromUrl;
		}
		if (subjectFromUrl) {
			url += "&subject=" + subjectFromUrl;
		}
		setLoading(true);
		apiService
			.get<{ data: StudentData[] }>("/search?" + url)
			.then((res) => {
				console.log(res.data);
				if (res.data?.data) {
					setData(res.data.data);
					console.log("getting");
				}
			})
			.catch((error) => {
				setError(true);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [searchParams]);
	if (data.length === 0) {
		return <NoData />;
	}
	return (
		<>
			{loading ? (
				<div className="absolute top-0 left-0 w-full h-full bg-slate-950/20 backdrop-blur-sm flex items-center justify-center">
					<Loader />
				</div>
			) : (
				<AssignBatchTable data={data} />
			)}
		</>
	);
}

export default page;
