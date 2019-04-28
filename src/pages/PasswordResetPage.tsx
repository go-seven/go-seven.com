import * as pdsp from "pdsp"
import * as React from "react"
import { connect } from "react-redux"
import { Redirect } from "react-router-dom"
import {
  Box,
  Button,
  Column,
  Content,
  Control,
  Field,
  Media,
  Message,
  Modal,
  Title,
} from "trunx"

import * as apiError from "../apiErrors"

import EmailField from "../components/EmailField"
import Footer from "../components/Footer"
import Logo from "../components/Logo"
import Navbar from "../components/Navbar"

import UrlCollectionPage from "./UrlCollectionPage"

import {
  sendPasswordReset,
  IAuthentication,
} from "../reducers/account"

interface IProps {
  authentication: IAuthentication
  isSendingPasswordReset: boolean
  passwordResetEmailSent: boolean
  sendPasswordReset: (email: string) => void
}

interface IState {
  redirect?: string
}

class PasswordResetPage extends React.Component<IProps, IState> {
  static path = "/password-reset"

  private emailRef = React.createRef<HTMLInputElement>()

  onSubmit = (event) => {
    pdsp(event)

    const email = this.emailRef.current && this.emailRef.current.value

    if (typeof email === "string") {
      this.props.sendPasswordReset(email)
    }
  }

  render() {
    const {
      authentication,
      isSendingPasswordReset,
      passwordResetEmailSent,
    } = this.props

    if (authentication.isValid) {
      return (
        <Redirect push to={UrlCollectionPage.path} />
      )
    }

    const error = authentication.error || { code: "", message: "" }

    const emailFieldError = error.code === apiError.AccountNotFoundError ? error.message : undefined

    return (
      <Modal isActive>
        <Modal.Background />

        <Modal.Content>
          <Column>
            <Box>
              <Media>
                <Media.Left>
                  <Logo />
                </Media.Left>

                <Media.Content>
                  <Content hasTextCentered>
                    <Title is4 hasTextGrey>Reset your password</Title>
                  </Content>
                </Media.Content>
              </Media>

              {passwordResetEmailSent ? (
                <Message isSuccess>
                  <Message.Header>
                    Email sent
                  </Message.Header>

                  <Message.Body>
                    <p>
                      Password reset email was sent successfully.
                      Please check your email inbox and also your <em>spam</em> folder.
                    </p>

                  </Message.Body>
                </Message>
              ) : (
                <form
                  onSubmit={this.onSubmit}
                >
                  <EmailField
                    errorMessage={emailFieldError}
                    inputRef={this.emailRef}
                  />

                  <Field>
                    <Control>
                      <Button
                        isLoading={isSendingPasswordReset}
                        isSuccess
                        type="submit"
                        value="Send password reset email"
                      />
                    </Control>
                  </Field>
                </form>
              )}
            </Box>
          </Column>
        </Modal.Content>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => ({
  authentication: state.account.authentication,
  isSendingPasswordReset: state.account.isSendingPasswordReset,
  passwordResetEmailSent: state.account.passwordResetEmailSent,
})

const mapDispatchToProps = (dispatch) => ({
  sendPasswordReset: (email) => dispatch(sendPasswordReset(email)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PasswordResetPage)
