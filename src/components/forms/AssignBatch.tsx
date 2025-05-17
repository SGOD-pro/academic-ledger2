"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormItem,
	FormLabel,
	FormMessage,
	FormField,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import ApiService from "@/lib/ApiService";
import { set } from "mongoose";
const apiService = new ApiService("/api/students/assign-batches");

// Zod validation schema
const FormSchema = z.object({
	batchSelections: z.record(
		z.string(), // Key of type string
		z.string({
			required_error: "Please select a batch.", // Value of type string
		})
	),
});
type FormSchemaType = z.infer<typeof FormSchema>;

function AssignBatch({ subjects, id }: { subjects: string; id: string }) {
	const subjectsArray = subjects.split(",");
	const [key, setKey] = useState(0);
	const batches = useSelector((state: RootState) => state.Batches.allBatches);
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			batchSelections: {}, // Initial default values
		},
	});

	useEffect(() => {
		async function fetch() {
			const res = await apiService.get<{ data: FormSchemaType }>(
				`?id=${id}`,
				false
			);
			if (res.success && res.data && res.data.data) {
				const formData: any = res.data.data;
				form.reset({
					batchSelections: { ...formData },
				});
				setKey(key + 1);
			}
		}

		fetch();
	}, []);

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		const batches = Object.values(data.batchSelections);

		const res = await apiService.post(`?id=${id}`, batches);
		if (res.success) {
			toast({
				description: "Batch assigned successfully",
			});
		} else {
			toast({
				description: res.error?.message || "Something went wrong",
				variant: "destructive",
			});
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-6"
				key={key}
			>
				{subjectsArray.map((subject, index) => {
					const filteredBatches = batches.filter(
						(batch) => batch.subject === subject
					);

					return (
						<FormField
							key={index}
							control={form.control}
							name={`batchSelections.${subject}`}
							render={({ field }) => (
								<FormItem>
									<FormLabel>{subject}</FormLabel>
									<FormControl className="capitalize">
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<SelectTrigger>
												<SelectValue
													placeholder={`Select a batch for ${subject}`}
													className="capitalize"
												/>
											</SelectTrigger>
											<SelectContent>
												{filteredBatches.length > 0 ? (
													filteredBatches.map((batch) => (
														<SelectItem
															key={batch._id}
															value={batch._id}
															className="capitalize"
														>
															{batch.days} - {batch.time}
														</SelectItem>
													))
												) : (
													<SelectItem value="no-batches" disabled>
														No batches available
													</SelectItem>
												)}
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					);
				})}
				<Button type="submit" disabled={form.formState.isSubmitting}>
					Assign Batches
				</Button>
			</form>
		</Form>
	);
}

export default memo(AssignBatch);
