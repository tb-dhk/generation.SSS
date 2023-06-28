import { createSlice } from '@reduxjs/toolkit'

export let currencySlice = createSlice({
  name: 'currency',
  initialState: {
    value: 1,
  },
  reducers: {
    updateCurrency(state, action) {
      state.value = action.payload;
    }
  },
});

export let { updateCurrency }  = currencySlice.actions;
export default currencySlice.reducer;
