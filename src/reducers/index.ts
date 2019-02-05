import { combineReducers } from "redux"

import authentication from "./authentication"
import collections from "./collections"
import preferences from "./preferences"
import statistics from "./statistics"
import storage from "./storage"

export default combineReducers({
  authentication,
  collections,
  preferences,
  statistics,
  storage,
})
