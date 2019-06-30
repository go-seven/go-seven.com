import * as pdsp from "pdsp"
import * as React from "react"
import InjectIntl from "react-intl-inject"
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

import EmailField from "../components/EmailField"
import LogoButton from "../components/LogoButton"

import UrlCollectionPage from "./UrlCollectionPage"

import {
  sendPasswordReset,
} from "../reducers/account"

interface IProps {
  authenticationIsValid: boolean
  isSendingPasswordReset: boolean
  errorMessage?: string
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
      authenticationIsValid,
      isSendingPasswordReset,
      errorMessage,
      passwordResetEmailSent,
    } = this.props

    if (authenticationIsValid) {
      return (
        <Redirect push to={UrlCollectionPage.path} />
      )
    }

    return (
      <Modal isActive>
        <Modal.Background />

        <Modal.Content>
          <Column>
            <Box>
              <Media>
                <Media.Left>
                  <LogoButton />
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
                    errorMessage={errorMessage}
                    inputRef={this.emailRef}
                  />

                  <Field>
                    <Control>
                      <InjectIntl>
                        {({ intl }) => (
                          <Button
                            isLoading={isSendingPasswordReset}
                            isSuccess
                            type="submit"
                            value={intl.formatMessage({ id: "PasswordResetPage.send" })}
                          />
                        )}
                      </InjectIntl>
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

const mapStateToProps = (state) => {
  const {
    account,
  } = state

  const {
    authentication,
    isSendingPasswordReset,
    passwordResetEmailSent,
  } = account

  const authenticationIsValid = authentication === null ? false : authentication.isValid

  const authenticationError = authentication && authentication.error
  const errorMessage = authenticationError && authenticationError.message

  return {
    authenticationIsValid,
    errorMessage,
    isSendingPasswordReset,
    passwordResetEmailSent,
  }
}

const mapDispatchToProps = (dispatch) => ({
  sendPasswordReset: (email) => dispatch(sendPasswordReset(email)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PasswordResetPage)
