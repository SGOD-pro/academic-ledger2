"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import ApiService from "@/lib/ApiService";
const apiService = new ApiService("/api/payment");

const FormSchema = z.object({
	name: z.string().min(2, {
		message: "Name must be at least 2 characters.",
	}),
	admissionNo: z
		.string()
		.min(2, {
			message: "Admission number must be required",
		})
		.regex(/^CA-\d{2}\/\d{2}-\d+$/),
	lastPaid: z.date().optional(),
	currentDate: z.date().default(() => new Date()),
	amount: z.string().min(2, {
		message: "Amount must be required",
	}),
	noOfMonths: z.string(),
});
const parseDateString = (dateString: string): Date | undefined => {
    const [day, month, year] = dateString.split("/").map(Number);
    // Check if the parsed values are valid numbers
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year, month - 1, day); // Month is 0-based in JavaScript Date
    }
    return undefined;
};
function PaymentForm({ data }: { data?: StudentPaymentInterface }) {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			name: data?.name || "",
			currentDate: new Date(),
			noOfMonths: "1",
			lastPaid:  data?.lastPaid ? parseDateString(data.lastPaid) : undefined,
			admissionNo: data?.admissionNo || "",
			amount: data?.fees?.toString() || "",
		},
	});
	async function onSubmit(value: z.infer<typeof FormSchema>) {
		if (!data?._id) {
			toast({
				title: "Error",
				description: "Doesn't get the  student id",
				variant: "destructive",
			});
			return;
		}
		apiService.post(`?id=${data?._id}`, value);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="grid grid-cols-2 gap-3"
			>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder="Name" {...field} readOnly />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="admissionNo"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Admission no</FormLabel>
							<FormControl>
								<Input placeholder="CA-2X/2Y-XX" {...field} readOnly />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="lastPaid"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>LastPaid</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant={"outline"}
											className={cn(
												"pl-3 text-left font-normal",
												!field.value && "text-muted-foreground"
											)}
											disabled
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
											date > new Date() || date < new Date("2024-01-01")
										}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="currentDate"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>Current date</FormLabel>
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
				<FormField
					control={form.control}
					name="amount"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Amount</FormLabel>
							<FormControl>
								<Input placeholder="6000" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="noOfMonths"
					render={({ field }) => (
						<FormItem>
							<FormLabel>No of Months</FormLabel>
							<FormControl>
								<Input
									placeholder="shadcn"
									{...field}
									type="number"
									max={11}
									min={1}
								/>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
}
export default PaymentForm;
