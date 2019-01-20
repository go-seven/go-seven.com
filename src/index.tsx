import * as React from "react"
import { render } from "react-dom"

import Root from "./Root"

window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("cache.js", { scope: "/" })
  }

  render(
    <Root />,
    document.getElementById("root")
  )
})
