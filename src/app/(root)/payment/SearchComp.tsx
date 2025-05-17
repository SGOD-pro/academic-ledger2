import React from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
} from "@/components/ui/dialog";
import SearchResult from "./SearchResult";
function SearchComp() {
    const [open, setOpen] = React.useState(false);

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			console.log(e.key);

			if (e.key === "f" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);
	return (
		<>
			<Button
				onClick={() => setOpen(true)}
				variant={"outline"}
				className="flex justify-between w-72"
			>
				<span className=" opacity-50 hover:opacity-100">Search....</span>
				<p className="text-sm text-muted-foreground ml-3">
					<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 text-sm">
						<span className="text-xs">⌘</span>f
					</kbd>
				</p>
			</Button>
			<Dialog open={open} onOpenChange={setOpen}>
				<SearchResult />
			</Dialog>
		</>
	);
}

export default SearchComp;
