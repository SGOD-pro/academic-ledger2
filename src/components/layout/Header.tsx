import React from "react";
import { ExperimentalParseClassNameParam } from "tailwind-merge";

function Header({
	children,
	className="",
}: {
	children: React.ReactNode;
	className?: HTMLDivElement["className"];
}) {
	return (
		<header className={`custom-border p-3 h-16 ${className}`}>
			{children}
		</header>
	);
}

export default Header;
