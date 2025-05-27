import React from "react";
import { Button } from "@/components/ui/button";
import {
	EnvelopeClosedIcon,
	GearIcon,
	PersonIcon,
	RocketIcon,
} from "@radix-ui/react-icons";

import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from "@/components/ui/command";
import {
	House,
	CalendarClock,
	ClipboardList,
	FileText,
	CreditCard,
	CheckSquare,
	Award,
	UsersRound,
	CalendarCheck,
	Search,
	SearchIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const links = [
	{
		pathname: "Home",
		route: "/",
		icon: <House />, // Home icon
	},
	{
		pathname: "Days & Time",
		route: "/days-time",
		icon: <CalendarClock />, // Calendar with clock icon for days & time
	},
	{
		pathname: "Batches",
		route: "/manageBatch",
		icon: <ClipboardList />, // Clipboard with list icon for managing batches
	},
	{
		pathname: "Attendance",
		route: "/attendence",
		icon: <CheckSquare />, // Checkmark icon for attendance
	},
	{
		pathname: "Payment",
		route: "/payment",
		icon: <CreditCard />, // Dollar sign icon for payment
		secondaryColor: "#00ADB5", // Optional color styling
	},
	{
		pathname: "Assignment",
		route: "/assignment",
		icon: <FileText />, // File icon for assignment
	},
	{
		pathname: "Result",
		route: "/result",
		icon: <Award />, // Award icon for results
	},
];
function SearchCommand({ showInput = true }: { showInput?: boolean }) {
	const [open, setOpen] = React.useState(false);
	const router = useRouter();
	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);
	return (
		<div className="w-full">
			{showInput && (
				<div className=" p-3 m-auto">
					<Button
						onClick={() => setOpen(true)}
						variant={"outline"}
						className=" justify-between items-center w-full hidden sm:flex bg-transparent text-background"
					>
						<SearchIcon size={20}/>
						<span className=" opacity-50 hover:opacity-100 hidden sm:block">
							Search
						</span>
						<p className="text-sm text-muted-foreground ml-3 hidden sm:block">
							<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 text-sm">
								<span className="text-xs">⌘</span>K
							</kbd>
						</p>
					</Button>
					<Button
						variant={"outline"}
						size={"icon"}
						onClick={() => setOpen(true)}
						className="sm:hidden hoverer:opacity-100 opacity-50"
					>
						<Search />
					</Button>
				</div>
			)}

			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder="Type a command or search..." />
				<CommandList className="scrollbar">
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup heading="RECORDS">
						<CommandItem onSelect={() => router.push("/all/all-students")}>
							<span>Students</span>
						</CommandItem>
						<CommandItem onSelect={() => router.push("/all/attendence-record")}>
							<span>Attendence</span>
						</CommandItem>
						<CommandItem onSelect={() => router.push("/all/all-assignments")}>
							<span>Assignment</span>
						</CommandItem>
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup heading="PAGES">
						{links.map((link) => (
							<CommandItem
								key={link.pathname}
								onSelect={() => router.push(link.route)}
							>
								<div className="flex gap-3 items-center w-full h-full">
									{link.icon}
									<span>{link.pathname}</span>
								</div>
							</CommandItem>
						))}
					</CommandGroup>
					<CommandSeparator />
				</CommandList>
			</CommandDialog>
		</div>
	);
}

export default SearchCommand;
