import Image from "next/image";
import React from "react";

function NoData() {
	return (
		<div className="w-full h-[82dvh] flex flex-col items-center justify-center overflow-hidden relative">
			<Image
				src="/no-data.svg"
				alt="nodata"
				width={1200}
				height={1200}
				className="object-contain w-[90%] h-[80%]"
			/>
			<h1 className="text-center font-semibold text-5xl absolute top-1/2 left-1/2 -translate-x-[40%] -translate-y-[10%]">
				No Data
			</h1>
		</div>
	);
}

export default NoData;
