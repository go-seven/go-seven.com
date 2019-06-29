import { combineReducers } from "redux"

import account from "./account"
import urlCollections from "./urlCollections"

export default combineReducers({
  account,
  urlCollections,
})
