"use client";
import React, { memo, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	House,
	CalendarClock,
	ClipboardList,
	FileText,
	CreditCard,
	CheckSquare,
	Award,
	ChevronRight,
} from "lucide-react";

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

function Navbar() {
	const pathname = usePathname();

	const [show, setShow] = useState<boolean>(false);
	const showNavFunc = useCallback((e: MouseEvent) => {
		if ((e.target as HTMLElement).id !== "show-nav-icon") {
			setShow(false);
		}
	}, []);

	useEffect(() => {
		document.addEventListener("click", showNavFunc);
		return () => {
			document.removeEventListener("click", showNavFunc);
		};
	}, [showNavFunc]);
	return (
		<>
			<span
				className="pi pi-angle-right bg-[#00ADB5] opacity-70 hover:opacity-100 rounded-r-lg p-2 mb-3 absolute z-50 top-0 left-0 block sm:hidden"
				id="show-nav-icon"
				onClick={() => setShow(true)}
			>
				<ChevronRight className="pointer-events-none"/>
			</span>
			<nav
				className={`w-32 fixed h-screen top-0 left-0 ${
					!show ? "-translate-x-full" : "-translate-x-0"
				} transition-all sm:-translate-x-0 sm:relative flex items-center justify-center md:w-52 z-50 bg-[#00ADB5] rounded-r-3xl sm:bg-transparent sm:z-0 shadow-lg shadow-black sm:shadow-none text-black`}
			>
				<i
					className="absolute pi pi-times top-3 right-5 sm:hidden"
					onClick={() => setShow(false)}
				></i>
				<ul className=" p-2 relative">
					{/* <div className="bg-red-500 absolute w-full h-14 -z-10"></div> */}
					{links.map((link, index) => (
						<li
							className={` h-14 transition-all hover:bg-[#08D9D6]/50 ${
								pathname === link.route
									? "bg-[#08D9D6]/70 shadow-slate-900 shadow"
									: "opacity-70"
							}  rounded-md flex items-center`}
							key={link.pathname}
						>
							<Link
								href={link.route}
								className={`flex items-center flex-col md:flex-row md:gap-4 py-2 px-4 w-full h-full `}
							>
								{link.icon}
								<h2 className=" leading-none text-sm md:text-base text-center capitalize">
									{link.pathname}
								</h2>
							</Link>
						</li>
					))}
				</ul>
			</nav>
		</>
	);
}

export default memo(Navbar);
