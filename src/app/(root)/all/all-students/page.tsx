"use client";
import Body from "@/components/layout/Body";
import Header from "@/components/layout/Header";
import React from "react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

function Students() {
	return (
		<div className="h-dvh p-2 md:p-4">
			<Header>
				<div className="flex gap-3 justify-end">
					<Input placeholder="Search" />
					<Select>
						<SelectTrigger className="">
							<SelectValue placeholder="By Name" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="apple">By Name</SelectItem>
								<SelectItem value="banana">By AdmissionNo</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
					<Select>
						<SelectTrigger className="">
							<SelectValue placeholder="Search by subjects" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="apple">By Name</SelectItem>
								<SelectItem value="banana">By AdmissionNo</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
			</Header>
		</div>
	);
}

export default Students;
