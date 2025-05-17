// import BatchesTable from "@/components/BatchesTable";
"use client";
import React, { FormEvent, lazy, useEffect } from "react";
import ApiService from "@/lib/ApiService";
import { useDispatch, useSelector } from "react-redux";
const apiService = new ApiService("/api/all-student");
import { RootState } from "@/store";
import { setStudents } from "@/store/slices";
import { toast } from "@/hooks/use-toast";
import Loader from "@/components/layout/Loader";
const AssignBatchTable = lazy(
	() => import("@/components/Tables/AssignBatchTable")
);

function ManageBatchPage() {
	const dispatch = useDispatch();
	const { isHydrated } = useSelector((state: RootState) => ({
		isHydrated: state.AssignBatches.isHydrated,
	}));
	const { data } = useSelector((state: RootState) => ({
		data: state.AssignBatches.allStudents,
	}));
	const [loading, setLoading] = React.useState(true);
	useEffect(() => {
		if (!isHydrated) {
			apiService
				.get<{ data: StudentData[] }>("")
				.then((res) => {
					if (res.data?.data) {
						dispatch(setStudents(res.data.data));
					}
				})
				.catch((error) => {
					toast({
						title: "Error",
						description: error.message,
						variant: "destructive",
					});
				}).finally(() => {
					setLoading(false);
				});
		}else{
			setLoading(false);
		}
	}, []);

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

export default ManageBatchPage;
