"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { StudentSchema } from "@/schema/Student";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
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
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import ApiService from "@/lib/ApiService";
import FileInput from "@/components/ui/FileInput";
import { updateAdmissionNo } from "@/store/slices";

const studyInOptions = [
	{ id: "school", label: "School" },
	{ id: "college", label: "College" },
];

type StudentSchemaInterface = z.infer<typeof StudentSchema>;

const apiService = new ApiService<StudentSchemaInterface>("/api/students/curd");

function StudentForm({
	values,
	update,
	id,
}: {
	values?: StudentSchemaInterface;
	update?: boolean;
	id?: string;
}) {
	const dispatch = useDispatch();
	const subjects = useSelector(
		(state: RootState) => state.Subjects.allSubjects
	);

	const adno = useSelector(
		(state: RootState) => state.AdmissionNo.latestAdmissionNo
	);

	useEffect(() => {
		if (adno) {
			form.setValue("admissionNo", adno);
		}
	}, [adno]);

	const form = useForm<StudentSchemaInterface>({
		resolver: zodResolver(StudentSchema),
		defaultValues: values || {
			admissionDate: new Date(),
			studyIn: "school",
			subjects: [],
			admissionNo: adno || "CA-20/21-1",
		},
	});
	const [key, setKey] = useState(0);
	const [cancelBtn, setCancelBtn] = useState(false);
	useEffect(() => {
		if (update) setCancelBtn(update);
	}, [update]);

	function onSubmit(data: StudentSchemaInterface) {
		const handleSuccess = (action: string) => {
			toast({
				title: `${action} Successfully`,
				description: <p>Student {action.toLowerCase()} successfully</p>,
				variant: "default",
			});
		};

		const handleError = (error: Error) => {
			toast({
				title: "Error",
				description: <p>{error.message}</p>,
				variant: "destructive",
			});
		};
		if (update && !id) {
			handleError(new Error("ID not found"));
			return;
		}
		const apiCall = update
			? apiService.put<{ data: StudentDetailsInterfaceWithId }>(
					`?id=${id}`,
					data,
					true
			  )
			: apiService.post<{ data: StudentDetailsInterfaceWithId }>(
					"",
					data,
					true
			  );

		apiCall
			.then((response) => {
				if (response.success) {
					handleSuccess(update ? "Updated" : "Added");
				}
				if (!update && response.data) {
					dispatch(updateAdmissionNo(response.data.data.admissionNo));
				}
			})
			.catch(handleError);

		form.reset();
		setKey((prev) => prev + 1);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				key={key}
				className="grid md:grid-cols-2 gap-3 items-center p-3 border rounded-lg"
			>
				{/* admissionNo */}
				<FormField
					control={form.control}
					name="admissionNo"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Admission No</FormLabel>
							<FormControl>
								<Input placeholder="shadcn" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* admissionDate */}
				<FormField
					control={form.control}
					name="admissionDate"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>Admission Date</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant={"outline"}
											className={cn(
												"w-full pl-3 text-left font-normal",
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
										disabled={(date) =>
											date > new Date() || date < new Date("1900-01-01")
										}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* name */}
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder="Souvik " {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="profilePicture"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Picture</FormLabel>
							<FormControl>
								<FileInput
									onChange={(file) => field.onChange(file)} // Ensure file change
									accept="image/*"
								/>
								{/* <Input placeholder="shadcn" type="file" accept="image/*" /> */}
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* stream */}
				<FormField
					control={form.control}
					name="stream"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Stream</FormLabel>
							<FormControl>
								<Input placeholder="Computer Science" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* institutionName */}
				<FormField
					control={form.control}
					name="institutionName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Institution Name</FormLabel>
							<FormControl>
								<Input placeholder="TDB College" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* subjects */}
				<FormField
					control={form.control}
					name="subjects"
					render={() => (
						<FormItem>
							<FormLabel className="text-base">Select Subject</FormLabel>
							<DropdownMenu modal={false}>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" className="ml-5">
										Open
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-56">
									<DropdownMenuLabel>Subjects</DropdownMenuLabel>
									<DropdownMenuSeparator />
									{subjects.map((item) => (
										<FormField
											key={item._id}
											control={form.control}
											name="subjects"
											render={({ field }) => {
												return (
													<DropdownMenuItem
														onSelect={(event) => event.preventDefault()}
													>
														<FormItem
															key={item._id}
															className="flex flex-row items-start space-x-3 space-y-0"
														>
															<FormControl className="space-y-4">
																<Checkbox
																	checked={field.value?.includes(item.subject)}
																	onCheckedChange={(checked) => {
																		return checked
																			? field.onChange([
																					...field.value,
																					item.subject,
																			  ])
																			: field.onChange(
																					field.value?.filter(
																						(value) => value !== item.subject
																					)
																			  );
																	}}
																/>
															</FormControl>
															<FormLabel className="font-normal capitalize">
																{item.subject}
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
				{/* studyIn */}
				<FormField
					control={form.control}
					name="studyIn"
					render={() => (
						<FormItem>
							<FormLabel className="text-base">Select Study In</FormLabel>

							<div className="flex items-stretch gap-4">
								{studyInOptions.map((item) => (
									<FormField
										key={item.id}
										control={form.control}
										name="studyIn"
										render={({ field }) => {
											return (
												<FormItem
													key={item.id}
													className="flex flex-row items-start space-x-3 space-y-0 border rounded-md px-3 py-2"
												>
													<FormControl>
														<Checkbox
															checked={field.value === item.id}
															onCheckedChange={(checked) => {
																return checked
																	? field.onChange(item.id)
																	: field.onChange("");
															}}
														/>
													</FormControl>
													<FormLabel className="text-sm font-normal">
														{item.label}
													</FormLabel>
												</FormItem>
											);
										}}
									/>
								))}
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>
				
				{/* PhoneNUmbers */}
				<div className="flex gap-2 items-center">
					<FormField
						control={form.control}
						name="phoneNo1"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Phone No 1</FormLabel>
								<FormControl>
									<Input
										placeholder="Phone No 1"
										value={field.value ? field.value.toString() : ""}
										onChange={(e) => {
											const newValue = e.target.value;
											if (newValue.length > 10) {
												return; // Prevent input if more than 10 digits
											}
											1;
											field.onChange(newValue);
										}}
										type="tel"
										maxLength={10} // Optionally enforce max length on input
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="phoneNo2"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Phone No 2</FormLabel>
								<FormControl>
									<Input
										placeholder="Phone No 2"
										value={field.value ? field.value.toString() : ""}
										onChange={(e) => {
											const newValue = e.target.value;
											if (newValue.length > 10) {
												return;
											}
											field.onChange(newValue);
										}}
										type="tel"
										maxLength={10}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name="fees"
					render={({ field }) => (
						<FormItem className="self-end">
							<FormLabel>Fees</FormLabel>
							<FormControl>
								<Input
									placeholder="Allow fees"
									typeof="number"
									value={field.value ? field.value.toString() : "0"}
									onChange={(e) => field.onChange(parseInt(e.target.value))}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex gap-2">
					<Button
						type="submit"
						className=" self-end"
						disabled={form.formState.isSubmitting}
					>
						Add
					</Button>
					{cancelBtn && (
						<Button
							type="button"
							className=" self-end"
							variant={"destructive"}
							disabled={form.formState.isSubmitting}
							onClick={() => {
								form.reset();
								setKey((pre) => pre + 1);
							}}
						>
							Cancel
						</Button>
					)}
				</div>
			</form>
		</Form>
	);
}

export default memo(StudentForm);
