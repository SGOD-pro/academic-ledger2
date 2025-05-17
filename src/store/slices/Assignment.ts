import GenericSliceHelper from "@/lib/GenericSliceHelper";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    allAssignments: [] as Assignment[],
    isHydrated: false,
};

const assignmentHelper = new GenericSliceHelper<Assignment>();

const assignmentSlice = createSlice({
    name: "assignment",
    initialState,
    reducers: {
        setAssignments: (state, action: PayloadAction<Assignment[]>) => {
            state.allAssignments = action.payload;
            state.isHydrated = true;
        },
        deleteAssignment: (state, action: PayloadAction<{ _id: string }>) => {
            assignmentHelper.delete({ data: state.allAssignments }, action);
        }
    },
});

export default assignmentSlice.reducer;

export const { setAssignments,deleteAssignment } = assignmentSlice.actions;