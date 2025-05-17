import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import GenericSliceHelper from "@/lib/GenericSliceHelper";

interface SubjectState {
	allSubjects: SubjectInterface[];
	hydrated: boolean;
}

const initialState: SubjectState = {
	allSubjects: [],
	hydrated: false,
};

const subjectHelper = new GenericSliceHelper<SubjectInterface>();

const subjectSlice = createSlice({
	name: "subjects",
	initialState,
	reducers: {
		setSubjects: (state, action: PayloadAction<SubjectInterface[]>) => {
			if (state.hydrated) {
				return;
			}
			state.allSubjects = action.payload;
			state.hydrated = true;
		},
		addSubject: (state, action: PayloadAction<SubjectInterface>) => {
			subjectHelper.add({ data: state.allSubjects }, action);
		},

		deleteSubject: (state, action: PayloadAction<{ _id: string }>) =>
			subjectHelper.delete({ data: state.allSubjects }, action),
	},
});

export const { setSubjects, addSubject, deleteSubject } = subjectSlice.actions;

export default subjectSlice.reducer;
