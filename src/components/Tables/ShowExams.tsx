"use client";
import { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AutoSizer } from "react-virtualized";
import { FixedSizeList as List } from "react-window";
import { RootState } from "@/store";
import { setAllExam } from "@/store/slices";
import ApiService from "@/lib/ApiService";

const apiService = new ApiService("/api/exam/curd");

function ShowExams() {
	const { hydrated, data } = useSelector((state: RootState) => ({
		hydrated: state.Exam.isHydrated,
		data: state.Exam.allExams,
	}));

	const dispatch = useDispatch();

	useEffect(() => {
		if (hydrated) return;
		async function fetch() {
			try {
				const res = await apiService.get<{ data: ExamsInterface[] }>("");
				console.log(res.data?.data);
				if (res.data?.data) {
					dispatch(setAllExam(res.data.data));
				}
			} catch (error) {
				console.error("Failed to fetch exams:", error);
			}
		}
		fetch();
	}, [hydrated, dispatch]);

	const Row = memo(({ index, style }: { index: number; style: any }) => {
		const exam = data[index];
		if (!exam) return null;
		return (
			<div
				key={index}
				style={style}
				className="grid grid-cols-4 items-center border-b p-2"
			>
				<div className="font-medium">{exam.subject}</div>
				<div>{exam.batch}</div>
				<div>{exam.fullMarks}</div>
				<div className="">{exam.date}</div>
			</div>
		);
	});

	return (
		<div className="text-sm h-[calc(100%-2.5rem)] relative min-w-[500px]">
			<div className="grid grid-cols-4 border-b font-semibold p-2 sticky top-0">
				<div>Subject</div>
				<div>Batch</div>
				<div>Full Marks</div>
				<div className="">Date</div>
			</div>
			{data && data.length > 0 ? (
				<AutoSizer>
					{({ height, width }) => (
						<List
							height={height}
							itemCount={data.length}
							itemSize={50}
							width={width}
							className="scrollbar px-2"
						>
							{Row}
						</List>
					)}
				</AutoSizer>
			) : (
				<div className="text-center p-4">No exams available.</div>
			)}
		</div>
	);
}

export default ShowExams;
