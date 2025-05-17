"use client";

import { memo, useEffect, useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import getCurrentlyFinishedBatch from "@/helper/GetFinishedBatch";

function SelectSubjectAndBatch({
	setBatchId,
	className,
	disable = false,
	selectClassName,
}: {
	setBatchId: React.Dispatch<React.SetStateAction<string | null>>;
	className?: string;
	selectClassName?: HTMLDialogElement["className"];
	disable?: boolean;
}) {
	const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
	const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);

	const subjects = useSelector(
		(state: RootState) => state.Subjects.allSubjects
	);
	const batches = useSelector((state: RootState) => state.Batches.allBatches);

	const filteredBatches = batches.filter(
		(batch) => batch.subject === selectedSubject
	);

	useEffect(() => {
		const data = getCurrentlyFinishedBatch(batches);
		console.log(data);
		if (data) {
			setSelectedSubject(data.subject);
			setSelectedBatchId(data._id);
			setBatchId(data._id);
		}
	}, [batches]);

	return (
		<div className={`flex gap-3 ${className}`}>
			<div className={selectClassName}>
				<Select
					onValueChange={(value) => {
						setSelectedSubject(value);
					}}
					value={selectedSubject || ""}
					disabled={disable}
					
				>
					<SelectTrigger >
						<SelectValue placeholder="Select a subject" />
					</SelectTrigger>
					<SelectContent>
						{subjects.map((subject) => (
							<SelectItem key={subject._id} value={subject.subject}>
								{subject.subject}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className={selectClassName}>
				<Select
					onValueChange={(value) => {
						setSelectedBatchId(value);
						setBatchId(value);
					}}
					disabled={!selectedSubject || disable}
					value={selectedBatchId || ""}
				>
					<SelectTrigger className="capitalize text-xs">
						<SelectValue
							placeholder={
								selectedSubject
									? "Select a batch"
									: "Please select a subject first"
							}
						/>
					</SelectTrigger>
					<SelectContent>
						{filteredBatches.length > 0 ? (
							filteredBatches.map((batch) => (
								<SelectItem
									key={batch._id}
									value={batch._id}
									className="capitalize text-xs"
								>
									{batch.days + " - " + batch.time}
								</SelectItem>
							))
						) : (
							<SelectItem value="no-batches" disabled>
								No batches available
							</SelectItem>
						)}
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}

export default memo(SelectSubjectAndBatch);
