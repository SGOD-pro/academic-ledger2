"use client";
import DialogComp from "@/components/Dialogcomp";
import Body from "@/components/layout/Body";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import React, { lazy, Suspense } from "react";
import { BookCheck } from "lucide-react";
const ExamForm = lazy(() => import("@/components/forms/AddExam"));
const ShowExams = lazy(() => import("@/components/Tables/ShowExams"));
import { Skeleton } from "@/components/ui/skeleton";

function ResultPage() {
	return (
		<div className="w-full h-dvh p-2 md:p-4">
			<Header>
				<DialogComp
					content={
						<Suspense fallback={<Skeleton className="w-full h-[60dvh]" />}>
							<ExamForm />
						</Suspense>
					}
					name={"Add Exam"}
				>
					<Button size={"icon"} variant={"secondary"}>
						<BookCheck size={20} />
					</Button>
				</DialogComp>
			</Header>
			<Body>
				<Suspense fallback={<Skeleton className="w-full h-full" />}>
					
						<ShowExams />
				</Suspense>
			</Body>
		</div>
	);
}

export default ResultPage;
