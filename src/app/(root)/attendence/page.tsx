"use client";
import React, { lazy, Suspense, useEffect } from "react";
import CheckBox from "./ChekcBox";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/layout/Header";
import Body from "@/components/layout/Body";
const SelectSubjectBatch = lazy(
	() => import("@/components/SelectSubjectBatch")
);
const AttendenceTable = lazy(
	() => import("@/components/Tables/AttendenceTable")
);

function AttendencePage() {
	const [batchId, setBatchId] = React.useState<string | null>("");
	return (
		<div className="w-full h-dvh p-4">
			<Header className="h-28 md:h-16">
				<Suspense fallback={<Skeleton className="w-full h-full" />}>
					<SelectSubjectBatch
						setBatchId={setBatchId}
						className="flex-wrap flex-col md:flex-row overflow-auto"
						selectClassName="flex-grow md:flex-grow-0 flex-shrink"
					/>
				</Suspense>
			</Header>
			<Body className="h-[calc(100%-7.75rem)] md:h-[calc(100%-4.75rem)]">
				<Suspense fallback={<Skeleton className="w-full h-full" />}>
					<AttendenceTable batchId={batchId} />
				</Suspense>
			</Body>
		</div>
	);
}

export default AttendencePage;
