import * as pdsp from "pdsp"
import * as React from "react"
import { connect } from "react-redux"
import {
  Button,
} from "trunx"

import Navbar from "../components/Navbar"

import {
  deleteAccount,
  exitAccount,
  IAuthentication,
} from "../reducers/account"

interface IProps {
  authentication: IAuthentication
  deleteAccount: () => void
  exitAccount: () => void
  isDeletingAccount: boolean
}

class SettingsPage extends React.Component<IProps> {
  static path = "/settings"

  onClickDeleteAccount = (event) => {
    pdsp(event)

    this.props.deleteAccount()
  }

  render() {
    const {
      authentication,
      exitAccount,
      isDeletingAccount,
    } = this.props

    if (authentication === null) {
      return null
    }

    return (
      <>
        <Navbar
          authenticationIsValid={authentication.isValid}
          exit={exitAccount}
        />

        <Button
          isDanger
          isLoading={isDeletingAccount}
          onClick={this.onClickDeleteAccount}
        >
          Delete Account
        </Button>

      </>
    )
  }
}

const mapStateToProps = (state) => ({
  authentication: state.account.authentication,
  isDeletingAccount: state.account.isDeleteing,
})

const mapDispatchToProps = (dispatch) => ({
  deleteAccount: () => dispatch(deleteAccount()),
  exitAccount: () => dispatch(exitAccount()),
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage)
