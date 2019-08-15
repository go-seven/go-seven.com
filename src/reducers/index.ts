import { combineReducers } from 'redux'

import account from './account'
import analytics from './analytics'
import urlCollections from './urlCollections'

export default combineReducers({
  account,
  analytics,
  urlCollections
})
