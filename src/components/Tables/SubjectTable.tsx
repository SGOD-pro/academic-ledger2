import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useSelector, useDispatch } from "react-redux";
import { deleteSubject } from "@/store/slices";
import { RootState } from "@/store";
import ApiService from "@/lib/ApiService";
import { toast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
const apiService = new ApiService("/api");
function SubjectTable() {
	const dispatch = useDispatch();
	const [disabled, setDisabled] = useState(false);
	const subjects = useSelector(
		(state: RootState) => state.Subjects.allSubjects
	);
	const deleteFunction = (id: string) => {
		setDisabled(true);
		apiService
			.delete(`/subjects?id=${id}`)
			.then((response) => {
				if (response.success) {
					dispatch(deleteSubject({ _id: id }));
				}
			})
			.catch((error) => {
				toast({
					title: "Error",
					description: error.message,
					variant: "destructive",
				});
			})
			.finally(() => setDisabled(false));
	};
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="">Name</TableHead>
					<TableHead className="text-right">Action</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{subjects.length > 0 ? (
					subjects.map((invoice) => (
						<TableRow key={invoice._id}>
							<TableCell className="font-medium">{invoice.subject}</TableCell>
							<TableCell className="font-medium text-right">
								<Button
									variant={"destructive"}
									onClick={() => deleteFunction(invoice._id)}
									disabled={disabled}
									size={"icon"}
								>
									<Trash2 />
								</Button>
							</TableCell>
						</TableRow>
					))
				) : (
					<TableRow className="">
						<TableCell className="">No Subjects</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}
export default SubjectTable;
