import * as history from "history"
import * as pdsp from "pdsp"
import * as React from "react"
import { connect } from "react-redux"
import {
  Box,
  Button,
  Section,
} from "trunx"

import ChangePasswordForm, { IChangePasswordFormProps } from "../components/ChangePasswordForm"
import Navbar from "../components/Navbar"

import {
  changePassword,
  deleteAccount,
  exitAccount,
  IAuthentication,
} from "../reducers/account"

interface IProps {
  authentication: IAuthentication
  changePassword: IChangePasswordFormProps["changePassword"]
  deleteAccount: () => void
  exitAccount: () => void
  isChangingPassword: boolean
  isDeletingAccount: boolean
  location: history.Location
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
      changePassword,
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
          locationPath={this.props.location.pathname}
          exit={exitAccount}
        />

        <Section>
          <Box>
            <ChangePasswordForm
              changePassword={changePassword}
              isChangingPassword={isChangingPassword}
            />
          </Box>
        </Section>

        <Section>
          <Button
            isDanger
            isLoading={isDeletingAccount}
            onClick={this.onClickDeleteAccount}
          >
            Delete Account
          </Button>
        </Section>
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
