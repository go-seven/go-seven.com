import * as history from "history"
import * as React from "react"
import { connect } from "react-redux"
import { Redirect } from "react-router-dom"
import {
  Box,
  Button,
  Buttons,
  Column,
  Modal,
  Notification,
  Section,
} from "trunx"

import HomePage from "./HomePage"

import ChangePasswordForm, { IChangePasswordFormProps } from "../components/ChangePasswordForm"
import Navbar from "../components/Navbar"

import {
  changePassword,
  deleteAccount,
  exitAccount,
} from "../reducers/account"

interface IProps {
  authenticationIsValid: boolean | null
  changePassword: IChangePasswordFormProps["changePassword"]
  deleteAccount: () => void
  exitAccount: () => void
  isChangingPassword: boolean
  isDeletingAccount: boolean
  justDeletedAccount: boolean
  location: history.Location
}

interface IState {
  askingAccountDeletionConfirmation: boolean
}

class SettingsPage extends React.Component<IProps> {
  static path = "/settings"

  state: IState = {
    askingAccountDeletionConfirmation: false
  }

  closeAccountDeletionConfirmation = () => {
    this.setState({
      askingAccountDeletionConfirmation: false
    })
  }

  onClickDeleteAccount = () => {
    this.setState({
      askingAccountDeletionConfirmation: true
    })
  }

  onClickConfirmAccountDeletion = () => {
    this.props.deleteAccount()
  }

  render() {
    const {
      authenticationIsValid,
      changePassword,
      exitAccount,
      isChangingPassword,
      isDeletingAccount,
      justDeletedAccount,
    } = this.props

    const {
      askingAccountDeletionConfirmation
    } = this.state

    if (justDeletedAccount) {
      return (
        <Modal isActive>
          <Modal.Background />

          <Notification>
            Your account was deleted.
          </Notification>
        </Modal>
      )
    }

    if (authenticationIsValid === null) {
      return null
    }

    if (authenticationIsValid === false) {
      return (
        <Redirect push to={HomePage.path}/>
      )
    }

    if (askingAccountDeletionConfirmation) {
      return (
        <Modal isActive>
          <Modal.Background onClick={this.closeAccountDeletionConfirmation} />

          <Modal.Close isLarge />

          <Modal.Content>
            <Column>
              <Notification isDanger>
                Are you sure you want to delete your account?
              </Notification>

              <Buttons>
                <Button onClick={this.closeAccountDeletionConfirmation}>
                  Cancel
                </Button>

                <Button
                  isDanger
                  isLoading={isDeletingAccount}
                  isOutlined
                  onClick={this.onClickConfirmAccountDeletion}
                >
                  Delete my account
                </Button>
              </Buttons>
            </Column>
          </Modal.Content>
        </Modal>
      )
    }

    return (
      <>
        <Navbar
          authenticationIsValid={authenticationIsValid}
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

const mapStateToProps = ({ account }) => {
  const { authentication } = account

  const authenticationIsValid = authentication === null ? null : authentication.isValid

  return {
    authenticationIsValid,
    isChangingPassword: account.isChangingPassword,
    isDeletingAccount: account.isDeleting,
    justDeletedAccount: account.justDeleted,
  }
}

const mapDispatchToProps = (dispatch) => ({
  changePassword: (password) => dispatch(changePassword(password)),
  deleteAccount: () => dispatch(deleteAccount()),
  exitAccount: () => dispatch(exitAccount()),
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage)
