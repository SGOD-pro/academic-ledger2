import { configureStore } from "@reduxjs/toolkit";
import Students from "./slices/Students";
import Subjects from "./slices/Subjects";
import Batches from "./slices/SubjectBatch";
import AdmissionNo from "./slices/AdmissionNo";
import AssignBatches from "./slices/AssignBatches";
import DuePayment from "./slices/DuePayment";
import Exam from "./slices/Exam";
import Assignment from "./slices/Assignment";

const store = configureStore({
	reducer: {
		Students,
		Subjects,
		Batches,
		AssignBatches,
		DuePayment,
		AdmissionNo,
		Exam,
		Assignment,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
