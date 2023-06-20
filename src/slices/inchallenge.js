import { createSlice } from '@reduxjs/toolkit'

export const inChallengeSlice = createSlice({
  name: 'challenge',
  initialState: {
    value: {},
  },
  reducers: {
    update: (state) => {
      state.value = JSON.parse(localStorage.getItem('challenge'))
    }
  },
})

export const { updateInChallengeSlice } = inChallengeSlice.actions

export default inChallengeSlice.reducer
