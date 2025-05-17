import React from "react";

function Body({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: HTMLDivElement["className"];
}) {
	return (
		<main className={`custom-border mt-3 h-[calc(100%-4.75rem)] overflow-auto scrollbar ${className}`}>
			{children}
		</main>
	);
}

export default Body;
