import React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

function DialogComp({
	children,
	content,
    name,
}: {
	children: React.ReactNode;
	content: React.ReactElement;
    name:string
}) {
	return (
		<Dialog>
			<DialogTrigger>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{name}</DialogTitle>
				</DialogHeader>
				{content}
			</DialogContent>
		</Dialog>
	);
}

export default DialogComp;
