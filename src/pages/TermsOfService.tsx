import * as React from "react"

import Navbar from "../components/Navbar"

export default class Homepage extends React.Component {
  static path = "/terms-of-service"

  render() {
    return (
      <Navbar />
    )
  }
}
