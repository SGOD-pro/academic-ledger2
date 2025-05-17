"use client";
import Body from "@/components/layout/Body";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { ChevronsLeftIcon } from "lucide-react";
import ApiService from "@/lib/ApiService";
import FeesRecordTable from "./FeesRecordTable";
const apiService = new ApiService("/api/payment");

function StudentPaymentDetails({
	params: { slug },
}: {
	params: { slug: string };
}) {
	const [student, setStudent] = useState<StudentPaymentInterface>();
	const [feesRecord, setFeesrecord] = useState<FeesRecord[]>([]);
	useEffect(() => {
		async function fetch() {
			const res = await apiService.get<{
				data: { feesRecords: FeesRecord[]; student: StudentPaymentInterface };
			}>(`/get-student?id=${slug}`);
			if (res.data?.data) {
				setStudent(res.data.data.student);
			}
			if (res.data?.data?.feesRecords) {
				setFeesrecord(res.data.data.feesRecords);
			}
		}
		fetch();
	}, []);
	return (
		<div className="p-4 h-dvh">
			<Header className="flex justify-between">
				<Button
					size={"icon"}
					variant={"outline"}
					onClick={() => window.history.back()}
				>
					<ChevronsLeftIcon />
				</Button>
				<div className="flex items-center gap-2">
					<div className="text-right">
						<h1 className="text-xl capitalize font-semibold leading-none">
							{student?.name}{" "}
							<span className="text-muted-foreground uppercase font-light text-sm">
								{"("}
								{student?.admissionNo}
								{")"}
							</span>
						</h1>
						<p className="text-xs font-light uppercase leading-none">
							<span>₹</span>
							{student?.fees}
						</p>
					</div>
					<div className="w-10 h-10">
						<Image
							src={student?.profilePicture || "/default.jpg"}
							alt="profile"
							width={50}
							height={50}
							className="rounded-full object-cover w-full h-full"
						/>
					</div>
				</div>
			</Header>
			<Body>
				{feesRecord.length == 0 ? (
					<div className="w-full h-[80%] mt-4">
						<Image
							src="/search.svg"
							alt="Page not found"
							width={100}
							height={100}
							className="m-auto w-full h-full object-contain"
						/>
						<h3 className="text-4xl font-semibold  font-serif text-center text-muted-foreground">
							No result found
						</h3>
					</div>
				) : (
					<div className="">
						<FeesRecordTable data={feesRecord} />
					</div>
				)}
			</Body>
		</div>
	);
}

export default StudentPaymentDetails;
