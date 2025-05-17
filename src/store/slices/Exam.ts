import GenericSliceHelper from "@/lib/GenericSliceHelper";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
	allExams: [] as ExamsInterface[],
	isHydrated: false,
};

const examHelper = new GenericSliceHelper<ExamsInterface>();

const examSlice = createSlice({
	name: "Exam",
	initialState,
	reducers: {
		setAllExam: (state, action: PayloadAction<ExamsInterface[]>) =>
			{state.allExams = action.payload;},
		pushExam: (state, action: PayloadAction<ExamsInterface>) =>
			examHelper.add({ data: state.allExams }, action),
		popExam: (state, action: PayloadAction<{ _id: string }>) =>
			examHelper.delete({ data: state.allExams }, action),
		updateExam: (state, action: PayloadAction<ExamsInterface>) =>
			examHelper.update({ data: state.allExams }, action),
	},
});

export const { setAllExam, pushExam, popExam, updateExam } = examSlice.actions;
export default examSlice.reducer;