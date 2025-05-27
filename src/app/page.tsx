"use client";
import React, { lazy, Suspense, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch, useSelector } from "react-redux";
import ApiService from "@/lib/ApiService";
const BatchForm = React.memo(lazy(() => import("@/components/forms/Addbatch")));
const AddSubject = React.memo(
	lazy(() => import("@/components/forms/AddSubject"))
);
const StudentForm = React.memo(
	lazy(() => import("@/components/forms/AddStudent"))
);
const NextBatch = React.memo(
	lazy(() => import("@/components/Tables/NextBatch"))
);
const SubjectTable = React.memo(
	lazy(() => import("@/components/Tables/SubjectTable"))
);
import { RootState } from "@/store";
import { updateAdmissionNo, setAdmissionNo } from "@/store/slices";


const apiService = new ApiService("/api/students/lastone");
export default function Home() {
	const dispatch = useDispatch();
	const hydrated = useSelector(
		(state: RootState) => state.AdmissionNo.isHydrated
	);
	useEffect(() => {
		if (hydrated) return;
		async function lastone() {
			const response = await apiService.get<{ admissionNo: string }>("");
			if (response.data) {
				dispatch(updateAdmissionNo(response.data.admissionNo));
			}
			if (response.error) {
				dispatch(setAdmissionNo("CA-24/25-1"));
			}
		}
		lastone();
	}, []);

	return (
		<div className="md:grid grid-cols-[2fr,1fr] w-full gap-3 xl:gap-5 p-2 md:p-4 scrollbar h-full">
			<section className=" overflow-auto">
				
				<Suspense fallback={<Skeleton className="w-full h-full" />}>
					<StudentForm />
				</Suspense>
				<div className=" mt-3">
					<BatchForm className=" sm:grid grid-cols-2 gap-3 items-center" />
				</div>
			</section>
			<section className=" overflow-auto space-y-3">
				<Suspense fallback={<Skeleton className="w-full h-full" />}>
					<NextBatch />
				</Suspense>
				<Suspense fallback={<Skeleton className="w-full h-full" />}>
					<AddSubject />
				</Suspense>
				<div className="custom-border p-3 max-h-96 overflow-auto">
					<SubjectTable />
				</div>
			</section>
		</div>
	);
}
