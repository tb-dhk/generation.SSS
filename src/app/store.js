import { configureStore } from '@reduxjs/toolkit'
import currencyReducer from '../slices/currency'
import inChallengeReducer from '../slices/inchallenge'

export default configureStore({
  reducer: {
    counter: currencyReducer,
  }
})
