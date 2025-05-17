import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import GenericSliceHelper from "@/lib/GenericSliceHelper";

const initialState: { allBatches: BatchInterface[],isHydrated:boolean } = {
	allBatches: [],
	isHydrated: false,
};
const batchHelper = new GenericSliceHelper<BatchInterface>();
export const batchSlice = createSlice({
	name: "batches",
	initialState,
	reducers: {
		setAllBatches: (state, action: PayloadAction<BatchInterface[]>) => {
			state.allBatches = action.payload;
			state.isHydrated = true;
		},
		pushBatches: (state: any, action: PayloadAction<BatchInterface>) =>
			batchHelper.add({ data: state.allBatches }, action),
		popBatches: (state, action: PayloadAction<{ _id: string }>) =>
			batchHelper.delete({ data: state.allBatches }, action),
		updateBatches: (state, action) =>
			batchHelper.update({ data: state.allBatches }, action),
	},
});

export const { setAllBatches, popBatches, pushBatches, updateBatches } =
	batchSlice.actions;
export default batchSlice.reducer;
