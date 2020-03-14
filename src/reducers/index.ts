import { combineReducers } from 'redux'

import * as account from './account'
import * as analytics from './analytics'
import * as urlCollections from './urlCollections'

export const initialState = {
  account: account.initialState,
  analytics: analytics.initialState,
  urlCollections: urlCollections.initialState,
}

export default combineReducers({
  account: account.default,
  analytics: analytics.default,
  urlCollections: urlCollections.default,
})
