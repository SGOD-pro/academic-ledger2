function toDateObj(timeString: string): Date {
	const date = new Date();
	const [hours, minutes] = timeString.split(":").map(Number);
	date.setHours(hours, minutes, 0, 0);
	return date;
}

function getCurrentlyFinishedBatch(
	batches: BatchInterface[]
): BatchInterface | null {
	const now = new Date();
	const currentDay = now.toLocaleString("en-US", { weekday: "long" }).toLowerCase(); 
	let result: BatchInterface | null = null;
	let minTimeDifference = Number.MAX_SAFE_INTEGER; 
	batches.forEach((batch) => {
		if (!batch.days.split(", ").map(day => day.toLowerCase()).includes(currentDay)) {
			return;
		}
		const [, endTime] = batch.time.split(" - ");
		const endTimeObj = toDateObj(endTime);
		const timeDifference = now.getTime() - endTimeObj.getTime();
		if (timeDifference > 0 && timeDifference < minTimeDifference) {
			minTimeDifference = timeDifference;
			result = batch;
		}
	});

	return result;
}

export default getCurrentlyFinishedBatch;
