"use client";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import ApiService from "@/lib/ApiService";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "@/hooks/use-toast";
import { Trash2, EditIcon } from "lucide-react";
import { Button } from "../ui/button";
import { popBatches, setAllBatches } from "@/store/slices";
import { RootState } from "@/store";
import { useEffect, useState } from "react";

const apiService = new ApiService("/api/batches/curd");
import { BatchFormInterface } from "@/components/forms/Addbatch";
const convertToTime = (timeString: string) => {
	const [hours, minutes] = timeString.split(":").map(Number);

	const date = new Date();

	date.setHours(hours);
	date.setMinutes(minutes);
	date.setSeconds(0);
	return date;
};
function BatchesTable({
	setBatValues,
	id,
}: {
	setBatValues?: React.Dispatch<
		React.SetStateAction<BatchFormInterface | undefined>
	>;
	id?: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
	const dispatch = useDispatch();
	const { batches } = useSelector((state: RootState) => ({
		batches: state.Batches.allBatches,

	}));
	const [disabled, setDisabled] = useState(false);
	const deleteBatch = async (id: string) => {
		setDisabled(true);
		const response = await apiService.delete(`?id=${id}`);

		if (response.success) {
			dispatch(popBatches({ _id: id }));
		}
		setDisabled(false);
	};
	const editBatch = (batch: BatchInterface) => {
		const [t1, t2] = batch.time.split(" - ");
		const data: BatchFormInterface = {
			subject: batch.subject,
			endTime: convertToTime(t1),
			startTime: convertToTime(t2),
			days: batch.days.split(", ").map((day) => day.trim()),
		};
		console.log(data);
		setBatValues?.(data);
		id?.(batch._id);
	};
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="">Subject</TableHead>
					<TableHead>Time</TableHead>
					<TableHead className="w-[200px]  overflow-auto">Days</TableHead>
					<TableHead className="text-right pr-4">Action</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{batches.map((batch) => (
					<TableRow key={batch._id}>
						<TableCell className="font-medium">{batch.subject}</TableCell>
						<TableCell>{batch.time}</TableCell>
						<TableCell className="w-[200px]  overflow-auto capitalize">
							{batch.days}
						</TableCell>
						<TableCell className="text-right">
							<div className="flex gap-2 justify-end">
								<Button
									variant="destructive"
									size="icon"
									onClick={() => deleteBatch(batch._id)}
									disabled={disabled}
								>
									<Trash2 className="w-4 h-4" />
								</Button>
								<Button
									variant="outline"
									size="icon"
									onClick={() => editBatch(batch)}
									disabled={disabled}
								>
									<EditIcon className="w-4 h-4" />
								</Button>
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
export default BatchesTable;
