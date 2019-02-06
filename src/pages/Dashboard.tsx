import * as React from "react"
import { connect } from "react-redux"

import Navbar from "../components/Navbar"
import UrlCreator from "../components/UrlCreator"

import {
  exit,
} from "../reducers/authentication"

import {
  createUrl,
} from "../reducers/storage"

class Dashboard extends React.Component {
  static path = "/dashboard"

  render() {
    return (
      <React.Fragment>
        <Navbar />

        <UrlCreator />
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  authentication: state.authentication
})

const mapDispatchToProps = (dispatch) => ({
  createUrl: (url) => dispatch(createUrl(url)),
  exit: () => dispatch(exit()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
