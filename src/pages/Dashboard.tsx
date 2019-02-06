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
}

class Dashboard extends React.Component<IProps> {
  static path = "/dashboard"

  render() {
    const {
      authentication,
    } = this.props

    return (
      <React.Fragment>
        <Navbar
          authenticationIsValid={authentication.isValid}
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
