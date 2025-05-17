"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import FileInput from "@/components/ui/FileInput";
import React, { useRef } from "react";
import SelectSubjectBatch from "../SelectSubjectBatch";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
  } from "@/components/ui/popover"
import FormSubmit from "@/hooks/AssignmentFormSubmit";
const FormSchema = z.object({
	file: z.instanceof(File),
	submissionDate:z.date().default(new Date()),
});
function UploadPDF() {
	const [batchId, setBatchId] = React.useState<string | null>("");
	const file = useRef<HTMLInputElement>(null)
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			submissionDate: new Date(),
		}
	});

	function onSubmit(data: z.infer<typeof FormSchema>) {
		if (!batchId) {
			toast({
				title: "Error",
				description: "Please select a batch",
				variant: "destructive",
			})
			return;
		}
		const res=FormSubmit({...data,batchId});
		res.then((res)=>{
			if (res) {
				if (file.current) {	
					file.current.value = "";
				}
				form.reset();
			}
		})
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
				<FormField
					control={form.control}
					name="file"
					render={({ field }) => (
						<FormItem>
							<FormLabel>File</FormLabel>
							<FormControl>
								<FileInput
									onChange={(file) => field.onChange(file)}
									accept="application/pdf"
									ref={file}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<SelectSubjectBatch setBatchId={setBatchId} />
				<FormField
					control={form.control}
					name="submissionDate"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>Submission Date</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant={"outline"}
											className={cn(
												" pl-3 text-left font-normal",
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
											date < new Date() || date < new Date("1900-01-01")
										}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" disabled={form.formState.isSubmitting} className="disabled:cursor-not-allowed">Submit</Button>
			</form>
		</Form>
	);
}
export default UploadPDF;
