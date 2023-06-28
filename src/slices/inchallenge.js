import { createSlice } from '@reduxjs/toolkit'

export let inChallengeSlice = createSlice({
  name: 'inChallenge',
  initialState: {
    value: 1,
  },
  reducers: {
    updateInChallenge(state, action) {
      state.value = action.payload;
    }
  },
});

export let { updateInChallenge }  = inChallengeSlice.actions;
export default inChallengeSlice.reducer;
