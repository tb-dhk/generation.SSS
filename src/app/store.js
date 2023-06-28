import { configureStore } from '@reduxjs/toolkit'
import currencyReducer from '../slices/currency'
import inChallengeReducer from '../slices/inchallenge'
import maxDimReducer from '../slices/maxdim'

export default configureStore({
  reducer: {
    currency: currencyReducer,
    inChallenge: inChallengeReducer,
    maxDim: maxDimReducer
  }
})
