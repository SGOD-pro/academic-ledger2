"use client";
import { Input } from "@/components/ui/input";
import React, { FormEvent, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";

function SearchForm({ route }: { route: string }) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const allSubjects = useSelector(
		(state: RootState) => state.Subjects.allSubjects
	);

	const [inputVal, setInputVal] = useState<string>("");
	const [selectedSubject, setSelectedSubject] = useState<string>("");

	useEffect(() => {
		const nameFromUrl = searchParams.get("name") || "";
		const subjectFromUrl = searchParams.get("subject") || "";

		setInputVal(decodeURI(nameFromUrl));
		setSelectedSubject(decodeURI(subjectFromUrl));
	}, [searchParams]);

	const submit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!inputVal && !selectedSubject) return;
		router.push(
			`${route}?name=${encodeURIComponent(
				inputVal
			)}&subject=${encodeURIComponent(selectedSubject)}`
		);
	};

	return (
		<form className="flex items-center justify-end gap-3" onSubmit={submit}>
			<Input
				className="w-64 outline-none focus:ring-0 active:outline-none"
				placeholder="Search by name..."
				value={inputVal}
				onChange={(e) => setInputVal(e.target.value)}
			/>

			<Select value={selectedSubject} onValueChange={setSelectedSubject}>
				<SelectTrigger>
					<SelectValue placeholder="Select a subject" />
				</SelectTrigger>
				<SelectContent>
					{allSubjects?.map((subject) => (
						<SelectItem key={subject._id} value={subject.subject}>
							{subject.subject}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Button type="submit" variant={"outline"}>
				<Search className="w-4 h-4" />
			</Button>
		</form>
	);
}

export default SearchForm;
