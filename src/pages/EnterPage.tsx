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

import * as apiError from "../apiErrors"

import EmailField from "../components/EmailField"
import LogoButton from "../components/LogoButton"
import PasswordField from "../components/PasswordField"

import {
  enterAccount,
  resetAuthenticationError,
  sendVerification,
  IAuthentication,
  ICredentials,
} from "../reducers/account"

import CreateAccountPage from "./CreateAccountPage"
import UrlCollectionPage from "./UrlCollectionPage"

interface IProps {
  authentication: IAuthentication
  emailVericationSent: boolean
  enterAccount: (ICredentials) => void
  isEnteringAccount: boolean
  isSendingVerification: boolean
  resetAuthenticationError: () => void
  sendVerification: (email: string) => void
}

interface IState {
  redirect?: string
}

class EnterPage extends React.Component<IProps, IState> {
  static path = "/enter"

  state: IState = {}

  private emailRef = React.createRef<HTMLInputElement>()
  private passwordRef = React.createRef<HTMLInputElement>()

  componentDidMount() {
    const {
      resetAuthenticationError,
    } = this.props

    resetAuthenticationError()
  }

  onClickCreateAccount = () => {
    this.setState({
      redirect: CreateAccountPage.path
    })
  }

  onClickSendVerificationEmail = (event) => {
    pdsp(event)

    const {
      sendVerification
    } = this.props

    const email = this.emailRef.current && this.emailRef.current.value

    if (typeof email === "string") {
      sendVerification(email)
    }
  }

  onSubmit = (event) => {
    pdsp(event)

    const email = this.emailRef.current && this.emailRef.current.value
    const password = this.passwordRef.current && this.passwordRef.current.value

    this.props.enterAccount({ email, password })
  }

  render() {
    const {
      authentication,
      emailVericationSent,
      isEnteringAccount,
      isSendingVerification,
    } = this.props

    const {
      redirect
    } = this.state

    if (authentication === null) {
      return null
    }

    if (authentication.isValid) {
      return (
        <Redirect push to={UrlCollectionPage.path} />
      )
    }

    if (redirect) {
      return (
        <Redirect push to={redirect} />
      )
    }

    const errorCode = authentication.error && authentication.error.code

    const emailFieldErrorCode = errorCode === apiError.AccountNotFoundError ? errorCode : null
    const passwordFieldErrorCode = errorCode === apiError.InvalidPasswordError ? errorCode : null
    const accountNotVerifiedError = errorCode === apiError.AccountNotVerifiedError

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
                    <Title is4 hasTextGrey>Enter GoSeven</Title>
                  </Content>
                </Media.Content>
              </Media>

              <form
                autoComplete="on"
                onSubmit={this.onSubmit}
              >
                <InjectIntl>
                  {({ intl }) => (
                    <EmailField
                      errorMessage={emailFieldErrorCode && intl.formatMessage({ id: `EnterPage.email.${errorCode}` })}
                      inputRef={this.emailRef}
                    />
                  )}
                </InjectIntl>

                <InjectIntl>
                  {({ intl }) => (
                    <PasswordField
                      errorMessage={passwordFieldErrorCode && intl.formatMessage({ id: `EnterPage.password.${errorCode}` })}
                      inputRef={this.passwordRef}
                      showForgotPassword
                    />
                  )}
                </InjectIntl>

                <Field>
                  <Control>
                    <Button
                      isLoading={isEnteringAccount}
                      isSuccess
                      type="submit"
                      value="Enter"
                    />
                  </Control>
                </Field>
              </form>
            </Box>

            {accountNotVerifiedError && (
              <>
                {emailVericationSent ? (
                  <Message isSuccess>
                    <Message.Header>
                      Email sent
                    </Message.Header>

                    <Message.Body>
                      <p>
                        <b>Verification email</b> was sent successfully.
                        Please check your email inbox and also your <em>spam</em> folder.
                      </p>

                    </Message.Body>
                  </Message>
                ) : (
                  <>
                    <Message>
                      <Message.Header>
                        Account not verified.
                      </Message.Header>

                      <Message.Body>
                        <p>
                          Account was not verified yet.
                          Please check your email inbox and also your <em>spam</em> folder.
                          Look for <b>verification email</b>, if not found you can try to resend it.
                        </p>

                      </Message.Body>
                    </Message>

                    <Field>
                      <Control>
                        <Button
                          isLoading={isSendingVerification}
                          isWarning
                          onClick={this.onClickSendVerificationEmail}
                        >
                          Resend Email
                        </Button>
                      </Control>
                    </Field>
                  </>
                )}
              </>
            )}

            <Box>
              <p>
                New to GoSeven?
                &nbsp;

                <a onClick={this.onClickCreateAccount}>
                  Create an account.
                </a>
              </p>
            </Box>
          </Column>
        </Modal.Content>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => ({
  authentication: state.account.authentication,
  emailVericationSent: state.account.emailVericationSent,
  isEnteringAccount: state.account.isEntering,
  isSendingVerification: state.account.isSendingVerification,
})

const mapDispatchToProps = (dispatch) => ({
  enterAccount: (credentials) => dispatch(enterAccount(credentials)),
  resetAuthenticationError: () => dispatch(resetAuthenticationError()),
  sendVerification: (email) => dispatch(sendVerification(email)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EnterPage)
