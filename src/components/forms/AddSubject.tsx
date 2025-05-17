"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { Input } from "@/components/ui/input";
import { subjectSchema } from "@/schema/Batches";
import { useDispatch } from "react-redux";
import ApiService from "@/lib/ApiService";
import { add } from "date-fns";
import { addSubject } from "@/store/slices";
import { LoaderCircle } from "lucide-react";
import React, { useEffect } from "react";
const apiService = new ApiService("/api/subjects");
type SubjectSchema = z.infer<typeof subjectSchema>;
function SubjectForm() {
	const dispatch = useDispatch();
	const form = useForm<SubjectSchema>({
		resolver: zodResolver(subjectSchema),
	});
	const [key, setKey] = React.useState(0);


	function onSubmit(data: SubjectSchema) {
		apiService
			.post<{ data: SubjectInterface }>("", data)
			.then((response) => {
				if (response.data) {
					toast({
						title: "Subject Added",
						description: "Subject added successfully",
					});
					dispatch(addSubject(response.data.data));
				}
			})
			.catch((error) => {
				toast({
					title: "Error",
					description: error.message,
					variant: "destructive",
				});
			});
		form.reset();
		setKey(key + 1);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-3 custom-border p-3"
				key={key}
			>
				<FormField
					control={form.control}
					name="subject"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Subject</FormLabel>
							<FormControl>
								<Input placeholder="Java" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" disabled={form.formState.isSubmitting}>
					{form.formState.isSubmitting ? (
						<LoaderCircle className=" animate-spin" />
					) : (
						"Add"
					)}
				</Button>
			</form>
		</Form>
	);
}
export default SubjectForm;
