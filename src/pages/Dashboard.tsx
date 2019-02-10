import * as React from "react"
import { connect } from "react-redux"

import Navbar from "../components/Navbar"
import UrlCreator from "../components/UrlCreator"

import {
  exit,
  IAuthenticationState,
} from "../reducers/authentication"

import {
  createUrl,
} from "../reducers/storage"

interface IProps {
  authentication: IAuthenticationState
  exit: () => void
}

class Dashboard extends React.Component<IProps> {
  static path = "/dashboard"

  render() {
    const {
      authentication,
      exit,
    } = this.props

    return (
      <React.Fragment>
        <Navbar
          authenticationIsValid={authentication.isValid}
          exit={exit}
        />

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
