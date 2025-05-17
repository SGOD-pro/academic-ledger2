import React, { FormEvent, useRef } from "react";
import {
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Search } from "lucide-react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import ApiService from "@/lib/ApiService";
import Link from "next/link";
const apiService = new ApiService("/api/students/search");
const FormSchema = z.object({
	admissionNo: z.string().regex(/^CA-\d{2}\/\d{2}-\d+$/),
});
function SearchResult() {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			admissionNo: "",
		},
	});
	const [data, setData] = React.useState<StudentData>();
	async function onSubmit(data: z.infer<typeof FormSchema>) {
		const response = await apiService.get<{ data: StudentData[] }>(
			`?admissionNo=${data.admissionNo}`,
			false
		);

		if (response?.data?.data) {
			setData(response.data.data[0]);
		}
	}

	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle className="text-sm font-thin relative">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="flex border-b w-[95%] m-auto relative items-start"
						>
							<Search className="w-4 h-4 mt-2" />
							<FormField
								control={form.control}
								name="admissionNo"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormControl>
											<input
												placeholder="Search by admission number"
												{...field}
												className="border-none font-thin focus:outline-none w-full px-3 py-2 bg-transparent"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</form>
					</Form>
				</DialogTitle>
			</DialogHeader>
			{data?._id ? (
				<Link
					className="bg-zinc-900/50 hover:bg-zinc-900 p-2 rounded-md flex justify-between"
					href={`/payment/search/${data?._id}`}
				>
					<div className="flex gap-2 items-center">
						<Image
							src={data?.profilePicture || "/default.jpg"}
							alt="Profile Picture"
							width={100}
							height={100}
							className="w-12 h-12 rounded-full object-cover"
						></Image>
						<h2>{data?.name}</h2>
					</div>
				</Link>
			) : (
				<p className="text-cetner m-auto">No data found</p>
			)}
		</DialogContent>
	);
}

export default SearchResult;
