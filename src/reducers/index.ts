import { combineReducers } from "redux"

import account from "./account"
import collections from "./collections"

export default combineReducers({
  account,
  collections,
})
