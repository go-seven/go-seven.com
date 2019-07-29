import * as pdsp from "pdsp"
import * as React from "react"
import { connect } from "react-redux"
import {
  Button,
} from "trunx"

import ChangePasswordForm from "../components/ChangePasswordForm"
import Navbar from "../components/Navbar"

import {
  changePassword,
  deleteAccount,
  exitAccount,
  IAuthentication,
} from "../reducers/account"

interface IProps {
  authentication: IAuthentication
  deleteAccount: () => void
  exitAccount: () => void
  isChangingPassword: boolean
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
      isChangingPassword,
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

        <ChangePasswordForm
          isChangingPassword={isChangingPassword}
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

const mapStateToProps = ({ account }) => ({
  authentication: account.authentication,
  isChangingPassword: account.isChangingPassword,
  isDeletingAccount: account.isDeleting,
})

const mapDispatchToProps = (dispatch) => ({
  changePassword: (password) => dispatch(changePassword(password)),
  deleteAccount: () => dispatch(deleteAccount()),
  exitAccount: () => dispatch(exitAccount()),
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage)
