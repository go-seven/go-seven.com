import * as React from "react"

import Features from "../components/Features"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import Pricing from "../components/Pricing"

export default class Homepage extends React.Component {
  static path = "/"

  render() {
    return (
      <React.Fragment>
        <Navbar />

        <Features />

        <Pricing />

        <Footer />
      </React.Fragment>
    )
  }
}
