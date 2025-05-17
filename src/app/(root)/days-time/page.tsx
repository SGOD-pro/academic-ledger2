"use client";
import { Skeleton } from "@/components/ui/skeleton";
import React, { lazy, Suspense, useState } from "react";

const BatchForm = React.memo(lazy(() => import("@/components/forms/Addbatch")));
const AddSubject = React.memo(
	lazy(() => import("@/components/forms/AddSubject"))
);
const BatchesTable = React.memo(
	lazy(() => import("@/components/Tables/BatchesTable"))
);
import { BatchFormInterface } from "@/components/forms/Addbatch";

function DaysTimePage() {
	const [batValues, setBatValues] = useState<BatchFormInterface>();
	const [id, setId] = useState<string | undefined>();
	return (
		<div className="grid md:grid-cols-2 gap-3 w-full h-dvh  p-2 md:p-4">
			<div className=" space-y-3">
				<Suspense fallback={<Skeleton className="w-full h-36" />}>
					<AddSubject />
				</Suspense>
				<Suspense fallback={<Skeleton className="w-full h-72" />}>
					<BatchForm id={id} values={batValues} setId={setId} setValues={setBatValues}/>
				</Suspense>
			</div>
			<div className="custom-border overflow-auto h-full scrollbar">
				<Suspense fallback={<Skeleton className="w-full h-full" />}>
					<BatchesTable setBatValues={setBatValues} id={setId} />
				</Suspense>
			</div>
		</div>
	);
}

export default DaysTimePage;
