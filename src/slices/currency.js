import { createSlice } from '@reduxjs/toolkit'

export const currencySlice = createSlice({
  name: 'currency',
  initialState: {
    value: {},
  },
  reducers: {
    update: (state) => {
      state.value = JSON.parse(localStorage.getItem('currency'))
    }
  },
})

export const { updateCurrencySlice } = currencySlice.actions

export default currencySlice.reducer
