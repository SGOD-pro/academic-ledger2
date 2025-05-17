"use client";
import React from "react";
import SearchForm from "@/components/forms/SearchForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Body from "@/components/layout/Body";

function ManaggeBatch({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const pathname = usePathname();
	return (
		<div className="w-full h-dvh p-4 overflow-auto">
			<Header className={"flex justify-between"}>
				{pathname.includes("/search") && (
					<Link
						href={"/manageBatch"}
						className=" border p-2 rounded-md bg-slate-950/20 hover:bg-slate-800/60"
					>
						<ChevronLeft />
					</Link>
				)}
				<SearchForm route="/manageBatch/search" />
			</Header>
			<Body>{children}</Body>
		</div>
	);
}

export default ManaggeBatch;
