"use client";
import Body from "@/components/layout/Body";
import Header from "@/components/layout/Header";
import DuePyament from "@/components/Tables/DuePayment";
import React, { useEffect, useState, useCallback } from "react";
import SearchComp from "./SearchComp";
import ApiService from "@/lib/ApiService";

const apiService = new ApiService("/api");
import { setDuePayments } from "@/store/slices";
import { useSelector,useDispatch } from "react-redux";
import { RootState } from "@/store";

function PaymentPage() {
	const [data, setData] = useState<StudentPaymentInterface[]>([]);
	const [loading, setLoading] = useState(true);
	const dispatch=useDispatch()
	const hydrated = useSelector((state: RootState) => state.DuePayment.hydrated);
	const fetchData = useCallback(async () => {
		if (hydrated) {
			setLoading(false);
			return;
		}
		try {
			setLoading(true);
			const res = await apiService.get<{ data: StudentPaymentInterface[] }>(
				"/payment"
			);
			if (res.data?.data) {
				console.log("Fetched data:", res.data.data);
				setData([...res.data.data]);
				dispatch(setDuePayments(res.data.data));
			}
		} catch (error) {
			console.error("Failed to fetch students:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);
	return (
		<div className="w-full h-dvh p-4 overflow-auto">
			<Header className="flex justify-end">
				<SearchComp />
			</Header>
			<Body>
				<DuePyament loading={loading} />
			</Body>
		</div>
	);
}

export default PaymentPage;
