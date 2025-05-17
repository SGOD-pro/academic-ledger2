
export function formatData(data: StudentDetailsInterface): {
	subjectList: { name: string }[];
	formatedData: StudentDetailsInterface;
} {
	const subjectList = data.subjects.map((item: string): { name: string } => ({
		name: item.trim(),
	}));

	let date = new Date();
	if (data.admissionDate) {
		date = new Date(data.admissionDate);
	}
	const formatedData = {
		institutionName: data.institutionName,
		admissionNo: data.admissionNo,
		profilePicture: data.profilePicture || "",
		subjects: data.subjects,
		name: data.name,
		studyIn: data.studyIn,
		stream: data.stream,
		phoneNo1: data.phoneNo1,
		phoneNo2: data.phoneNo2 || "",
		fees: data.fees,
		admissionDate: date,
	};
	return { subjectList, formatedData };
}
