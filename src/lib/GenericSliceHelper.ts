import { PayloadAction } from "@reduxjs/toolkit";

class GenericSliceHelper<T extends { _id: string }> {

  add(state: { data: T[] }, action: PayloadAction<T>) {
    state.data.push(action.payload);
  }

  update(state: { data: T[] }, action: PayloadAction<T>) {
    const index = state.data.findIndex(item => item._id === action.payload._id);
    if (index !== -1) {
      state.data[index] = { ...state.data[index], ...action.payload }; // Mutate the specific item
    }
  }

  delete(state: { data: T[] }, action: PayloadAction<{ _id: string }>) {
    const index = state.data.findIndex(item => item._id === action.payload._id);
    if (index !== -1) {
      state.data.splice(index, 1);  
    }
  }
}

export default GenericSliceHelper;
