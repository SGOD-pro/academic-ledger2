"use client";
import DialogComp from "@/components/Dialogcomp";
import EditorForm from "@/components/forms/Editor";
import UploadPDF from "@/components/forms/UploadPDF";
import Body from "@/components/layout/Body";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import React, { lazy, Suspense, useState } from "react";
import { FileUp } from "lucide-react";
function AssignmentPage() {
	return (
		<div className="p-2 sm:p-4">
			<Header className="flex justify-end items-center">
				<span className=" text-muted-foreground text-sm">Upload File</span>
				<Suspense fallback={<Skeleton className="w-full h-full" />}>
					<DialogComp content={<UploadPDF />} name={"Upload PDF"}>
						<Button size={"icon"} variant={"outline"}>
							<FileUp size={20} />
						</Button>
					</DialogComp>
				</Suspense>
			</Header>
			<Body className="">
				<EditorForm />
			</Body>
		</div>
	);
}

export default AssignmentPage;
