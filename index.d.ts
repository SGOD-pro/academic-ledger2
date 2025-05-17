interface StudentDetailsInterface {
	admissionNo: string;
	institutionName: string;
	name: string;
	stream: string;
	profilePicture?: string;
	subjects: string[];
	admissionDate?: Date | null;
	fees: number;
	phoneNo1: string;
	phoneNo2?: string;
	studyIn: "school" | "college";
	lastPaid?: Date;
}
interface StudentDetailsInterfaceWithId {
	admissionNo: string;
	institutionName: string;
	name: string;
	stream: string;
	profilePicture?: string;
	subjects: string[];
	admissionDate?: Date | null;
	fees: number;
	phoneNo1: string;
	phoneNo2?: string;
	studyIn: "school" | "college";
	lastPaid?: Date;
	_id: string;
}

//new interface
interface BatchInterface {
	_id: string;
	time: string;
	days: string;
	subject: string;
}
interface SubjectInterface {
	_id: string;
	subject: string;
}
interface AddAssignmentInterface {
	fileURL: string | null;
	explanation: string | null;
	_id: string;
	subject: string;
	submissionDate: Date;
	issue: Date;
}

interface AddAssignmentInterface {
	_id: string;
	title: string;
	description: string;
}

interface ApiServicesResponse<T> {
	success: boolean;
	data?: T; // Optional, as it might be undefined in case of an error
	error?: Error | null; // Optional, with a null fallback
}

interface StudentData {
	admissionNo: string;
	name: string;
	subjects: string;
	_id: string;
	profilePicture?: string;
}

interface StudentPaymentInterface {
	_id: string;
	name: string;
	profilePicture: string;
	lastPaid: string | null;
	admissionNo: string;
	fees: string;
	admissionDate: string;
}
interface Assignment {
	_id: string;
	subject: string;
	batch: string;
	date: string;
}
interface ExamsInterface extends Assignment {
	fullMarks: number;
	description:string;
}

interface FeesRecord {
	paidMonth: string;
	paidDate: string;
}
