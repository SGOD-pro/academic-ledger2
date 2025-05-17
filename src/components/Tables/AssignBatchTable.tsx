"use client";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useState, memo, lazy, Suspense } from "react";
import { FixedSizeList as List } from "react-window";
import { AutoSizer } from "react-virtualized";
import { Button } from "../ui/button";
import { SlidersHorizontal } from "lucide-react";
import Image from "next/image";

import DialogComp from "../Dialogcomp";
const AssignBatch = lazy(() => import("../forms/AssignBatch"));
import { Skeleton } from "../ui/skeleton";

const Headers = memo(() => {
	return (
		<>
			<TableHead className="col-span-1">Admission No</TableHead>
			<TableHead className="col-span-1">Name</TableHead>
			<TableHead className="col-span-1">Subjects</TableHead>
			<TableHead className="col-span-1 text-right pr-4">Action</TableHead>
		</>
	);
});
Headers.displayName = "Headers";

const ProfileName = memo(({data}: {data: StudentData}) => {
	return (
		<div className="col-span-1 flex items-center gap-2">
					{data.profilePicture && (
						<div className="w-10 h-10 rounded-full overflow-hidden hidden lg:block">
							<Image
								src={data.profilePicture}
								width={100}
								height={100}
								alt={data.name[0]}
								loading="lazy"
								className="w-full h-full object-cover"
							/>
						</div>
					)}
					<span>{data.name}</span>
				</div>
	);
});

ProfileName.displayName = "ProfileName";
function AssignBatchTable({ data }: { data: StudentData[] }) {
	const [disabled, setDisabled] = useState(false);

	// Memoize row renderer to prevent unnecessary re-renders
	const Row = memo(({ index, style }: { index: number; style: any }) => {
		const batch = data[index];

		return (
			// Ensure the `style` prop is passed to the outer div for virtualization to work
			<div
				style={style}
				className="grid grid-cols-4 items-center gap-2 p-2 border-b"
			>
				{/* Admission No Column */}
				<div className="col-span-1">
					<span className="font-medium">{batch.admissionNo}</span>
				</div>
				{/* Name with Profile Picture */}
				<ProfileName data={batch} />
				{/* Subjects Column */}
				<div className="col-span-1 w-[200px] overflow-auto">
					{batch.subjects}
				</div>
				{/* Action Button */}
				<div className="col-span-1 text-right">
					<DialogComp
						content={
							<Suspense fallback={<Skeleton className="w-full h-56" />}>
								<AssignBatch subjects={batch.subjects} id={batch._id} />
							</Suspense>
						}
						name={batch.name}
					>
						<Button variant="secondary" size="icon" disabled={disabled}>
							<SlidersHorizontal className="w-4 h-4" />
						</Button>
					</DialogComp>
				</div>
			</div>
		);
	});
	
	return (
		<div className="text-sm h-full">
			{/* Table Header */}
			<div className="grid grid-cols-4 gap-2 py-2 border-b">
				<Headers />
			</div>
			<div className="border-t h-[90%]">
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
			</div>
		</div>
	);
}

export default AssignBatchTable;
