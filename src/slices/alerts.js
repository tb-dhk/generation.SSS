import { createSlice } from '@reduxjs/toolkit'

export let alertsSlice = createSlice({
  name: 'alerts',
  initialState: {
    value: {},
  },
  reducers: {
    addAlert(state, action) {
      const payload = action.payload
      console.log(payload)
      state.value[payload.id] = payload.message;
      console.log(state.value, "added")
    },
    closeAlert(state, action) {
      const payload = action.payload
      delete state.value[payload.id]
    },
    refreshAlerts(state){
      for (let id in state.value) {
        if (state.value[id].time - Date.now() > 15000) {
          delete state.value[id]
        }
      }
    },
  },
});

export let { addAlert, closeAlert, refreshAlerts }  = alertsSlice.actions;
export default alertsSlice.reducer;
