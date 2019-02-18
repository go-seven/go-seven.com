import * as React from "react"
import { render } from "react-dom"

import { version } from "../package.json"
import configureStore from "./store/configureStore"
import Root from "./Root"

import { initialState as account } from "./reducers/account"
import { initialState as collections } from "./reducers/collections"

const initialState = {
  account,
  collections,
}

window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) {
    // Register service worker, it is better to put it in the root public directory, i.e. under the max scope.
    navigator.serviceWorker.register(`cache.v${version}.js`, { scope: "/" })
  }

  render(<Root store={configureStore(initialState)} />, document.getElementById("root"))
})
