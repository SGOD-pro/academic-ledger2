import GenericSliceHelper from "@/lib/GenericSliceHelper";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";



const initialState = {
	allStudents: [] as StudentData[],
    isHydrated: false,
};

const studentHelper = new GenericSliceHelper<StudentData>();
export const studentSlice = createSlice({
	name: "Student",
	initialState,
	reducers: {
		setStudents: (state, action: PayloadAction<StudentData[]>) => {
			state.allStudents = action.payload;
            state.isHydrated = true;
		},
		pushStudents: (state, action: PayloadAction<StudentData>) =>
			studentHelper.add({ data: state.allStudents }, action),
		popStudent: (state, action: PayloadAction<{ _id: string }>) =>
			studentHelper.delete({ data: state.allStudents }, action),
	},
});
export const { setStudents, pushStudents, popStudent } =
	studentSlice.actions;
export default studentSlice.reducer;
