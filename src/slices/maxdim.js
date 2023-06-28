import { createSlice } from '@reduxjs/toolkit'

export let maxDimSlice = createSlice({
  name: 'maxDim',
  initialState: {
    value: 1,
  },
  reducers: {
    updateMaxDim(state, action) {
      state.value = action.payload;
    }
  },
});

export let { updateMaxDim }  = maxDimSlice.actions;
export default maxDimSlice.reducer;
