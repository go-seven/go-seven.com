import * as React from "react"

import Navbar from "../components/Navbar"

export default class Dashboard extends React.Component {
  static path = "/dashboard"

  render() {
    return (
      <Navbar />
    )
  }
}
