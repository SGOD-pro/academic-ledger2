import ApiService from "@/lib/ApiService";
import React, { useEffect, useState } from "react";

type BatchData = {
	batchName: string;
	instructorName: string;
	startTime: string;
	endTime: string;
	status: string;
};

const apiService = new ApiService("api/batches/nextBatch");

const isCacheExpired = (timestamp: number) => {
	const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds
	const currentTime = new Date().getTime();
	return currentTime - timestamp > thirtyMinutes;
};

function NextBatch() {
	const [nextBatch, setNextBatch] = useState<BatchData>();

	useEffect(() => {
		const fetchNextBatch = async () => {
			try {
				const response = await apiService.get<{ data: BatchData }>("");
				if (!response.data) return;
				// Update localStorage with new data and timestamp
				localStorage.setItem("nextBatch", JSON.stringify(response.data.data));
				localStorage.setItem("nextBatchTimestamp", JSON.stringify(new Date().getTime()));
				setNextBatch(response.data.data);
			} catch (error) {
				console.error("Error fetching next batch data:", error);
			}
		};

		// Check if there's cached data and if it's still valid
		const cachedData = localStorage.getItem("nextBatch");
		const cachedTimestamp = localStorage.getItem("nextBatchTimestamp");

		if (cachedData && cachedTimestamp && !isCacheExpired(Number(cachedTimestamp))) {
			// Use cached data if it's less than 30 minutes old
			// setNextBatch(JSON.parse(cachedData||""));
		} else {
			// Otherwise, fetch new data
			fetchNextBatch();
		}
	}, []);

	// Convert time to a more readable format
	const formatTime = (time: string) =>
		new Date(time).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});

	return (
		<>
			{nextBatch && (
				<div className="p-4 rounded-lg shadow-md bg-white border border-gray-200">
					<div className="flex justify-between items-center">
						<h2 className="text-xl font-semibold">{nextBatch.batchName}</h2>
						<span
							className={`px-3 py-1 rounded-full text-sm font-medium ${
								nextBatch.status === "Ongoing"
									? "bg-green-100 text-green-800"
									: "bg-yellow-100 text-yellow-800"
							}`}
						>
							{nextBatch.status}
						</span>
					</div>
					<div className="mt-2">
						<p className="text-gray-500">
							Instructor: {nextBatch.instructorName}
						</p>
						<p className="mt-1 text-gray-700">
							Start Time: {formatTime(nextBatch.startTime)}
						</p>
						<p className="mt-1 text-gray-700">
							End Time: {formatTime(nextBatch.endTime)}
						</p>
					</div>
					<div className="mt-4">
						<button className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md">
							View Details
						</button>
					</div>
				</div>
			)}
		</>
	);
}

export default NextBatch;
