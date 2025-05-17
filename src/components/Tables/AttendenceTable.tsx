"use client";
import CheckBox from "@/app/(root)/attendence/ChekcBox";
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
	TableCell,
} from "@/components/ui/table";
import ApiService from "@/lib/ApiService";
import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import Loader from "../layout/Loader";
import { Button } from "../ui/button";
import {ClipboardCheck} from "lucide-react"
const apiService = new ApiService("/api");

type StudentData = {
	admissionNo: string;
	name: string;
	subjects: string;
	_id: string;
};

type AttendenceTableProps = {
	batchId: string | null;
};

const AttendenceRow = memo(
	({
		student,
		isSelected,
		onToggle,
	}: {
		student: StudentData;
		isSelected: boolean;
		onToggle: () => void;
	}) => (
		<TableRow key={student._id}>
			<TableCell className="font-medium">{student.admissionNo}</TableCell>
			<TableCell>{student.name}</TableCell>
			<TableCell>{student.subjects}</TableCell>
			<TableCell className="p-3 lg:pr-7 flex justify-start">
				<div className="">
					<CheckBox checked={isSelected} onChange={onToggle} />
				</div>
			</TableCell>
		</TableRow>
	),
	(prevProps, nextProps) =>
		prevProps.isSelected === nextProps.isSelected &&
		prevProps.student._id === nextProps.student._id
);
AttendenceRow.displayName = "Attendence Row";
const Headers = memo(() => {
	return (
		<TableRow>
			<TableHead className="">Admission No</TableHead>
			<TableHead>Name</TableHead>
			<TableHead>Subject</TableHead>
			<TableHead className="p-3 lg:pr-7">Action</TableHead>
		</TableRow>
	);
});
Headers.displayName = "Table Headers";
function AttendenceTable({ batchId }: AttendenceTableProps) {
	const [data, setData] = useState<StudentData[]>([]);
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	const [loading, setLoading] = useState(true);

	const fetchData = useCallback(async () => {
		if (!batchId) {
			setLoading(false);
			return;
		}
		try {
			setLoading(true);
			const res = await apiService.get<{ data: StudentData[] }>(
				"/attendence/get-students?id=" + batchId
			);
			if (res.data?.data) {
				setData(res.data.data);
			}
		} catch (error) {
			console.error("Failed to fetch students:", error);
		} finally {
			setLoading(false);
		}
	}, [batchId]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const toggleAttendence = useCallback((id: string) => {
		setSelectedIds((prev) => {
			const updatedSet = new Set(prev);
			if (updatedSet.has(id)) {
				updatedSet.delete(id);
			} else {
				updatedSet.add(id);
			}
			return updatedSet;
		});
	}, []);

	const setAttendence = async () => {
		if (selectedIds.size === 0) {
			return;
		}
		await apiService.post("/attendence", {
			batchId,
			studentsId: Array.from(selectedIds),
		});
	};

	const memoizedRows = useMemo(
		() =>
			data.map((student) => (
				<AttendenceRow
					key={student._id}
					student={student}
					isSelected={selectedIds.has(student._id)}
					onToggle={() => toggleAttendence(student._id)}
				/>
			)),
		[data, selectedIds, toggleAttendence]
	);

	if (loading) {
		return (
			<div className="absolute top-0 left-0 flex items-center justify-center w-full h-full backdrop-blur-sm">
				<Loader />
			</div>
		);
	}
	if (data.length === 0) {
		return (
			<div className="flex items-center justify-center w-full h-full">
				<h2 className="text-4xl">No student</h2>
			</div>
		);
	}

	return (
		<>
			<Table>
				<TableHeader>
					<Headers />
				</TableHeader>
				<TableBody>{memoizedRows}</TableBody>
			</Table>
			<Button className="fixed bottom-10 right-8" onClick={setAttendence} disabled={selectedIds.size === 0}>Save<ClipboardCheck className="ml-2"/></Button>
		</>
	);
}

export default memo(AttendenceTable);
