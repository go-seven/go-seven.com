import * as React from "react"
import { render } from "react-dom"
import { Provider } from "react-redux"

import configureStore from "./store/configureStore"
import Root from "./Root"

const initialState = {}

window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("cache.js", { scope: "/" })
  }

  render(
    <Provider store={configureStore(initialState)}>
      <Root />
    </Provider>,
    document.getElementById("root")
  )
})
