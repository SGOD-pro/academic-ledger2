import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
	latestAdmissionNo: "",
	isHydrated: false,
};

const admissionNo = createSlice({
	initialState,
	name: "admissionNo",
	reducers: {
		setAdmissionNo: (state, action: PayloadAction<string>) => {
			state.latestAdmissionNo = action.payload;
			state.isHydrated = true;
		},
		updateAdmissionNo: (state, action: PayloadAction<string>) => {
			const lastDigit = action.payload.split("-");
			state.latestAdmissionNo = `CA-${new Date().getFullYear() % 100}/${
				(new Date().getFullYear() % 100) + 1
			}-${
				(lastDigit &&
				Array.isArray(lastDigit) &&
				+lastDigit[lastDigit.length - 1]
					? +lastDigit[lastDigit.length - 1]
					: 0) + 1
			}`;
			state.isHydrated = true;
		},
	},
});

export const { setAdmissionNo,updateAdmissionNo } = admissionNo.actions;
export default admissionNo.reducer;
