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
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { batcheSchema } from "@/schema/Batches";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import ApiService from "@/lib/ApiService";
import { memo, useEffect, useState } from "react";
import { pushBatches, updateBatches } from "@/store/slices";
import { toIST } from "@/helper/DateTime";
import { Check, X } from "lucide-react";
const formatTime = (date: Date) => {
	if (!date) date = new Date();
	const hours = date.getHours().toString().padStart(2, "0");
	const minutes = date.getMinutes().toString().padStart(2, "0");
	return `${hours}:${minutes}`;
};

// Convert 'HH:mm' string to Date
const parseTime = (time: string) => {
	const [hours, minutes] = time.split(":").map(Number);
	const now = new Date();
	now.setHours(hours, minutes, 0, 0); // Set hours and minutes
	return now;
};
const items = [
	{
		id: "sunday",
		label: "Sunday",
	},
	{
		id: "monday",
		label: "Monday",
	},
	{
		id: "tuesday", // Changed from "Tue" to "tuesday"
		label: "Tuesday",
	},
	{
		id: "wednesday", // Changed from "Wed" to "wednesday"
		label: "Wednesday",
	},
	{
		id: "thursday", // Changed from "Thu" to "thursday"
		label: "Thursday",
	},
	{
		id: "friday", // Changed from "Fri" to "friday"
		label: "Friday",
	},
	{
		id: "saturday", // Changed from "Sat" to "saturday"
		label: "Saturday",
	},
];

export type BatchFormInterface = z.infer<typeof batcheSchema>;
const apiService = new ApiService("/api/batches/curd");

function BatchForm({
	className,
	values,
	setValues,
	id,
	setId,
}: {
	className?: React.HTMLAttributes<HTMLDivElement>["className"];
	values?: BatchFormInterface;
	id?: string;
	setValues?: React.Dispatch<
		React.SetStateAction<BatchFormInterface | undefined>
	>;
	setId?: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
	const subjects = useSelector(
		(state: RootState) => state.Subjects.allSubjects
	);
	const [update, setUpdate] = useState(false);
	const dispatch = useDispatch();
	const form = useForm<BatchFormInterface>({
		resolver: zodResolver(batcheSchema),
		defaultValues: {
			days: [],
			startTime: new Date(),
			endTime: new Date(),
		},
	});

	const [key, setKey] = useState(0);

	useEffect(() => {
		console.log(values);
		if (id && values && !update) {
			form.reset(values);
			setUpdate(true);
		}
	}, [id, values]);

	async function onSubmit(data: BatchFormInterface) {
		data.endTime = toIST(data.endTime);
		data.startTime = toIST(data.startTime);
		let response;
		if (!update)
			response = await apiService.post<{ data: BatchInterface }>("", data);
		else
			response = await apiService.put<{ data: BatchInterface }>(
				`?id=${id}`,
				data
			);

		if (!response.data?.data) {
			toast({
				title: "Error",
				description: "Cannot get data",
			});
			return;
		}
		if (!update) {
			dispatch(pushBatches(response.data.data));
		} else {
			setUpdate(false);
			dispatch(updateBatches(response.data.data));
		}
		form.reset({
			days: [],
			startTime: new Date(),
			endTime: new Date(),
			subject:""
		});
		setKey(key + 1);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className={`custom-border p-3 ${className}`}
				key={key}
			>
				<FormField
					control={form.control}
					name="subject"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Subject</FormLabel>
							<Select
								onValueChange={(value) => field.onChange(value)} // Update form state when value changes
								value={field.value || ""} // Bind the current value from form state
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select a subject" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{subjects?.map((item) => (
										<SelectItem value={item.subject} key={item._id}>
											{item.subject}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="startTime"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Start Time</FormLabel>
							<Input
								type="time"
								value={formatTime(field.value)}
								onChange={(e) => {
									const parsedStartTime = parseTime(e.target.value);

									field.onChange(parsedStartTime);

									const endTime = new Date(parsedStartTime);
									endTime.setHours(endTime.getHours() + 1);
									endTime.setMinutes(endTime.getMinutes() + 30);

									form.setValue("endTime", endTime);
								}}
							/>

							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="endTime"
					render={({ field }) => (
						<FormItem>
							<FormLabel>End Time</FormLabel>
							<Input
								type="time"
								value={formatTime(field.value)} // Convert Date to time string
								onChange={(e) => field.onChange(parseTime(e.target.value))} // Convert time string back to Date
							/>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="days"
					render={() => (
						<FormItem>
							<FormLabel className="text-base">Select Days</FormLabel>
							<DropdownMenu modal={false}>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" className="ml-5">
										Open
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-56">
									<DropdownMenuLabel>Days</DropdownMenuLabel>
									<DropdownMenuSeparator />
									{items.map((item) => (
										<FormField
											key={item.id}
											control={form.control}
											name="days"
											render={({ field }) => {
												return (
													<DropdownMenuItem
														onSelect={(event) => event.preventDefault()}
													>
														<FormItem
															key={item.id}
															className="flex flex-row items-start space-x-3 space-y-0"
														>
															<FormControl className="space-y-4">
																<Checkbox
																	checked={field.value?.includes(item.id)}
																	onCheckedChange={(checked) => {
																		return checked
																			? field.onChange([
																					...field.value,
																					item.id,
																			  ])
																			: field.onChange(
																					field.value?.filter(
																						(value) => value !== item.id
																					)
																			  );
																	}}
																/>
															</FormControl>
															<FormLabel className="font-normal">
																{item.label}
															</FormLabel>
														</FormItem>
													</DropdownMenuItem>
												);
											}}
										/>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
							<FormMessage />
						</FormItem>
					)}
				/>
				{!update ? (
					<Button type="submit" disabled={form.formState.isSubmitting}>
						Add
					</Button>
				) : (
					<div className="flex gap-3">
						<Button
							type="submit"
							disabled={form.formState.isSubmitting}
							size={"icon"}
							variant={"outline"}
						>
							<Check className="w-4 h-4" />
						</Button>
						<Button
							type="button"
							disabled={form.formState.isSubmitting}
							size={"icon"}
							variant={"ghost"}
							onClick={() => {
								form.reset({
									days: [],
									startTime: new Date(),
									endTime: new Date(),
								});
								setValues?.(undefined);
								setId?.(undefined);
							}}
						>
							<X className="w-4 h-4" />
						</Button>
					</div>
				)}
			</form>
		</Form>
	);
}
export default memo(BatchForm);
