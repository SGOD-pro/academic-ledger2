import GenericSliceHelper from "@/lib/GenericSliceHelper";
import { createSlice,PayloadAction } from "@reduxjs/toolkit";

const initialState={
    allDuePayments:[] as StudentPaymentInterface[],
    hydrated:false as boolean
}


const duePaymentHelper = new GenericSliceHelper<StudentPaymentInterface>();

const duePaymentSlice = createSlice({
    name: "duePayment",
    initialState,
    reducers: {
        setDuePayments: (state, action: PayloadAction<StudentPaymentInterface[]>) => {
            if (state.hydrated) {
                return;
            }
            state.allDuePayments = action.payload;
            state.hydrated = true;
        },
        removeStudentPayment: (state, action: PayloadAction<{ _id: string }>) => {
            duePaymentHelper.delete({ data: state.allDuePayments }, action);
        },
    },
});

export const { setDuePayments ,removeStudentPayment} = duePaymentSlice.actions;
export default duePaymentSlice.reducer; 