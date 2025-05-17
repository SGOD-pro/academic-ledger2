"use client";
import { useState, memo, lazy, Suspense, useEffect, useCallback } from "react";
import { FixedSizeList as List } from "react-window";
import { AutoSizer } from "react-virtualized";
import { Button } from "../ui/button";
import { IndianRupee } from "lucide-react";
import Image from "next/image";
import DialogComp from "../Dialogcomp";
import Loader from "../layout/Loader";
import { Skeleton } from "../ui/skeleton";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
const PaymentForm = lazy(() => import("../forms/PaymentForm"));

const Headers = memo(() => {
	return (
		<>
			<div className="">Admission No</div>
			<div className="">Name</div>
			<div className="">Admission Date</div>
			<div className=" text-right pr-4">Pay</div>
		</>
	);
});
Headers.displayName = "Headers";

const ProfileName = memo(
	({ student }: { student: StudentPaymentInterface }) => {
		const [imgSrc, setImgSrc] = useState(student.profilePicture);
		return (
			<div className="flex items-center gap-2">
				{student.profilePicture && (
					<div className="w-10 h-10 rounded-full overflow-hidden hidden md:block">
						<Image
							src={imgSrc}
							width={100}
							height={100}
							alt={student.name[0]}
							loading="lazy"
							className="w-full h-full object-cover"
							onError={() => {
								setImgSrc("/default.jpg");
							}}
						/>
					</div>
				)}
				<span>{student.name}</span>
			</div>
		);
	}
);
ProfileName.displayName = "ProfileName";

function DuePayment({ loading }: { loading: boolean }) {
	// Memoize row renderer to prevent unnecessary re-renders
	const { data } = useSelector((state: RootState) => ({
		data: state.DuePayment.allDuePayments,
	}));
	const Row = memo(({ index, style }: { index: number; style: any }) => {
		const student = data[index];

		return (
			<div
				style={style}
				className="grid grid-cols-[1fr,1.7fr,.8fr,.5fr] items-center gap-2 p-2 border-b"
			>
				{/* Admission No Column */}
				<div className="">
					<span className="font-medium">{student.admissionNo}</span>
				</div>
				{/* Name with Profile Picture */}
				<ProfileName student={student} />
				{/* Admission Date Column */}
				<div className="w-[150px] ">
					<span>{student.admissionDate}</span>
				</div>
				{/* Pay Button */}
				<div className="text-right">
					<DialogComp
						content={
							<Suspense fallback={<Skeleton className="w-full h-56" />}>
								<PaymentForm data={student} />
							</Suspense>
						}
						name={student.name}
					>
						<Button size="icon">
							<IndianRupee size={16} />
						</Button>
					</DialogComp>
				</div>
			</div>
		);
	});

	return (
		<div className="text-sm h-full min-w-[500px]">
			{loading ? (
				<div className="absolute top-0 left-0 flex items-center justify-center w-full h-full backdrop-blur-sm">
					<Loader />
				</div>
			) : (
				<>
					<div className="grid grid-cols-[.7fr,1.5fr,1fr,.5fr] gap-2 p-2 border-b">
						<Headers />
					</div>
					{data.length ? (
						<div className="border-t h-[calc(100%-2.5rem)]">
							<AutoSizer>
								{({ height, width }) => (
									<List
										height={height}
										itemCount={data.length}
										itemSize={50}
										width={width}
										className="scrollbar px-2"
									>
										{Row}
									</List>
								)}
							</AutoSizer>
						</div>
					) : (
						<h1 className="text-2xl font-semibold text-center">
							No data found
						</h1>
					)}
				</>
			)}
		</div>
	);
}

export default memo(DuePayment);
