"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { examSchema } from "@/schema/Exam";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import SelectSubjectBatch from "../SelectSubjectBatch";
import { useState } from "react";
import { Input } from "../ui/input";
import { useDispatch } from "react-redux";
import { pushExam, updateExam } from "@/store/slices";
import ApiService from "@/lib/ApiService";
const apiService = new ApiService("/api/exam/curd");
const parseDateString = (dateString: string): Date | undefined => {
	const [day, month, year] = dateString.split("/").map(Number);
	if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
		return new Date(year, month - 1, day);
	}
	return undefined;
};
function ExamForm({ value, id }: { value?: ExamsInterface; id?: string }) {
	const form = useForm<z.infer<typeof examSchema>>({
		resolver: zodResolver(examSchema),
		defaultValues: {
			fullMarks: value?.fullMarks || 0,
			description: value?.description || "",
			date: parseDateString(value?.date || "") || new Date(),
		},
	});
	const dispatch = useDispatch();
	const [batchId, setBatchId] = useState<string | null>("");
	async function onSubmit(data: z.infer<typeof examSchema>) {
		if (!batchId || (value&&!value.batch)) {
			toast({
				title:
					!batchId && !value?.batch
						? "Cannot get the batch!"
						: "Please select a batch..!",
			});
			return;
		}
		const newData = { ...data, batch: batchId };
		const res = await apiService.post<{ data: ExamsInterface }>("", newData);
		if (res.data?.data) {
			dispatch(pushExam(res.data.data));
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
				<FormField
					control={form.control}
					name="date"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>Date</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant={"outline"}
											className={cn(
												"pl-3 text-left font-normal",
												!field.value && "text-muted-foreground"
											)}
										>
											{field.value ? (
												format(field.value, "PPP")
											) : (
												<span>Pick a date</span>
											)}
											<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
										selected={field.value}
										onSelect={field.onChange}
										disabled={(date) => date < new Date()}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormItem>
					<FormLabel>Selct Batch</FormLabel>
					<SelectSubjectBatch setBatchId={setBatchId} />
					<FormMessage />
				</FormItem>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea
									placeholder="A brief description of the exam"
									className="resize-none h-28"
									{...field}
								/>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="fullMarks"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Marks</FormLabel>
							<FormControl>
								<Input
									placeholder="marks"
									type="number"
									value={field.value + ""}
									onChange={(e) => field.onChange(Number(e.target.value))}
								/>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" disabled={form.formState.isSubmitting}>
					Add
				</Button>
			</form>
		</Form>
	);
}
export default ExamForm;
