import { configureStore } from '@reduxjs/toolkit'
import currencyReducer from '../slices/currency'
import inChallengeReducer from '../slices/inchallenge'
import alertsReducer from '../slices/alerts'

export default configureStore({
  reducer: {
    currency: currencyReducer,
    inChallenge: inChallengeReducer,
    alerts: alertsReducer
  }
})
