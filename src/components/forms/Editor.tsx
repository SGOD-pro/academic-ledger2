"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Editor } from "@tinymce/tinymce-react";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import React, { lazy, useState } from "react";
const SelectSubjectBatch = lazy(
	() => import("@/components/SelectSubjectBatch")
);

const formSchema = z.object({
	content: z.string().min(1, "Content is required"),
	submissionDate: z.date().default(new Date()),
});
import { CalendarIcon, UploadIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import FormSubmit from "@/hooks/AssignmentFormSubmit";
import { toast } from "@/hooks/use-toast";
function EditorForm({ value }: { value?: string }) {
	const [batchId, setBatchId] = useState<string | null>("");
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			content: value || "",
			submissionDate: new Date(),
		},
	});

	function onSubmit(data: z.infer<typeof formSchema>) {
		if (!batchId) {
			toast({
				title: "Error",
				description: "Please select a batch",
				variant: "destructive",
			});
			return;
		}
		const res = FormSubmit({ ...data, batchId });
		res.then((res) => {
			if (res) {
				form.reset();
			}
		});
	}

	return (
		<Form {...form}>
			<form className="" onSubmit={form.handleSubmit(onSubmit)}>
				<FormField
					name="content"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Editor
									apiKey={process.env.NEXT_PUBLIC_EDITOR_KEY}
									initialValue=""
									init={{
										height: "75dvh",
										menubar: true,
										plugins: [
											"advlist",
											"autolink",
											"lists",
											"link",
											"image",
											"charmap",
											"print",
											"preview",
											"anchor",
											"searchreplace",
											"visualblocks",
											"code",
											"fullscreen",
											"insertdatetime",
											"media",
											"table",
											"paste",
											"help",
											"wordcount ",
										],
										toolbar:
											"undo redo | blocks | image | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent removeformat | help",
										content_style: `
                            body, html, .mce-content-body {
                              font-family: Helvetica, Arial, sans-serif;
                              font-size: 14px;
                              border-radius: 8rem;
                              background-color: black;
                              color: white;
                              outline: none;
                            }
                          `,
										placeholder: "Write here...",
										skin: "oxide-dark",
										content_css: "dark",
									}}
									onEditorChange={field.onChange}
								/>
							</FormControl>
							<FormMessage></FormMessage>
						</FormItem>
					)}
				/>
				<div className="flex items-center justify-end m-3 gap-3 flex-wrap lg:flex-nowrap">
					<SelectSubjectBatch
						setBatchId={setBatchId}
						className="flex-wrap"
						selectClassName="flex-grow lg:flex-grow-0 flex-shrink lg:flex-shrink-0"
					/>
					<FormField
						control={form.control}
						name="submissionDate"
						render={({ field }) => (
							<FormItem className="flex flex-col flex-grow lg:flex-grow-0 flex-shrink lg:flex-shrink-0">
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant={"outline"}
												className={cn(
													"w-full lg:w-[240px] pl-3 text-left font-normal ",
													!field.value && "text-muted-foreground"
												)}
											>
												{field.value ? (
													format(field.value, "PPP")
												) : (
													<span>Submission Date</span>
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
					<Button type="submit" disabled={form.formState.isSubmitting} size={"icon"}>
						<UploadIcon />
					</Button>
				</div>
			</form>
		</Form>
	);
}
export default EditorForm;
