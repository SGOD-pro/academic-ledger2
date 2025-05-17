"use client";
import axios from "axios";
import React, { lazy, useEffect, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSubjects, setAllBatches } from "@/store/slices";
import { RootState } from "@/store";
import ApiService from "@/lib/ApiService";
const apiService = new ApiService("/api/batches/curd");
function App({ children }: { children: React.ReactNode }) {
	const dispatch = useDispatch();
	const subjctHydrated = useSelector(
		(state: any) => state.Subjects.subjectsHydrated
	);
	useEffect(() => {
		if (!subjctHydrated) {
			axios.get<{ data: SubjectInterface[] }>("/api/subjects").then((res) => {
				dispatch(setSubjects(res.data.data));
				console.log(res.data.data);
			});
		}
	}, []);
	const { batches, isHydrated } = useSelector((state: RootState) => ({
		batches: state.Batches.allBatches,
		isHydrated: state.Batches.isHydrated,
	}));
	useEffect(() => {
		if (!isHydrated) {
			apiService.get<{ data: BatchInterface[] }>("", false).then((res) => {
				if (res.data?.data) {
					dispatch(setAllBatches(res.data.data));
				}
			});
		}
	}, []);
	return (
		<main className="">
			{children}
		</main>
	);
}

export default App;
