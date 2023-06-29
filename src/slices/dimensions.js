import { createSlice } from '@reduxjs/toolkit'

export let dimensionsSlice = createSlice({
  name: 'dimensions',
  initialState: {
    value: 1,
  },
  reducers: {
    updateDimensions(state, action) {
      state.value = action.payload;
    }
  },
});

export let { updateDimensions }  = dimensionsSlice.actions;
export default dimensionsSlice.reducer;
