import * as React from "react"
import { render } from "react-dom"

import configureStore from "./store/configureStore"
import Root from "./Root"

import { initialState as authentication } from "./reducers/authentication"

const initialState = {
  authentication
}

window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("cache.js", { scope: "/" })
  }

  render(<Root store={configureStore(initialState)} />, document.getElementById("root"))
})
