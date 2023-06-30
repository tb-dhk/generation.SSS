import { createSlice } from '@reduxjs/toolkit'

class Alert {
  constructor(message) {
    this.message = message
    this.time = Date.now()
  }
}

export let alertsSlice = createSlice({
  name: 'alerts',
  initialState: {
    value: {},
  },
  reducers: {
    addAlert(state, action) {
      const payload = action.payload
      state.value[payload.id] = Alert(payload.message);
      console.log("added")
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
