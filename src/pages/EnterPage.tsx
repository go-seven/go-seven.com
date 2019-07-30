import * as pdsp from "pdsp"
import * as React from "react"
import { FormattedMessage } from "react-intl"
import InjectIntl from "react-intl-inject"
import { connect } from "react-redux"
import { Redirect } from "react-router-dom"
import {
  A,
  B,
  Box,
  Button,
  Column,
  Content,
  Control,
  Field,
  Media,
  Message,
  Modal,
  P,
  Title,
} from "trunx"

import * as apiError from "../apiErrors"

import EmailField from "../components/EmailField"
import LogoButton from "../components/LogoButton"
import PasswordField from "../components/PasswordField"

import {
  cleanupAuthenticationError,
  enterAccount,
  sendVerification,
  IAuthentication,
  ICredentials,
} from "../reducers/account"

import CreateAccountPage from "./CreateAccountPage"
import MyUrlsPage from "./MyUrlsPage"

interface IProps {
  authentication: IAuthentication
  cleanupAuthenticationError: () => void
  emailVericationSent: boolean
  enterAccount: (ICredentials) => void
  errorCode?: string
  isEntering: boolean
  isSendingVerification: boolean
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
    this.props.cleanupAuthenticationError()
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
      errorCode,
      isEntering,
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
        <Redirect push to={MyUrlsPage.path} />
      )
    }

    if (redirect) {
      return (
        <Redirect push to={redirect} />
      )
    }

    const emailFieldError = errorCode === apiError.EmailNotFoundError
    const passwordFieldError = errorCode === apiError.InvalidPasswordError
    const emailNotVerifiedError = errorCode === apiError.EmailNotVerifiedError

    return (
      <Modal isActive>
        <Modal.Background />

        <Modal.Content>
          <Column>
            {emailNotVerifiedError ? null : (
              <Box>
                <Media>
                  <Media.Left>
                    <LogoButton />
                  </Media.Left>

                  <Media.Content>
                    <Content hasTextCentered>
                      <Title is4 hasTextGrey>
                        <FormattedMessage id={"EnterPage.title"} />
                      </Title>
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
                        errorMessage={emailFieldError && intl.formatMessage({ id: `EnterPage.email.${errorCode}` })}
                        inputRef={this.emailRef}
                      />
                    )}
                  </InjectIntl>

                  <InjectIntl>
                    {({ intl }) => (
                      <PasswordField
                        errorMessage={passwordFieldError && intl.formatMessage({ id: `EnterPage.password.${errorCode}` })}
                        inputRef={this.passwordRef}
                        showForgotPassword
                      />
                    )}
                  </InjectIntl>

                  <Field>
                    <Control>
                      <Button
                        isLoading={isEntering}
                        isSuccess
                        type="submit"
                        value="Enter"
                      />
                    </Control>
                  </Field>
                </form>
              </Box>
            )}_

            {emailNotVerifiedError && (
              <>
                {emailVericationSent ? (
                  <Message isSuccess>
                    <Message.Header>
                      Email sent
                    </Message.Header>

                    <Message.Body>
                      <P>
                        <b>Verification email</b> was sent successfully.
                        Please check your email inbox and also your <em>spam</em> folder.
                      </P>

                    </Message.Body>
                  </Message>
                ) : (
                  <>
                    <Message isWarning>
                      <Message.Header>
                        Account not verified.
                      </Message.Header>

                      <Message.Body>
                        <P>
                          Account was not verified yet.
                          <br />
                          Please check your email inbox, look for <B hasTextSuccess>verification email</B>.
                          <br />
                          If not found you can try to resend it.
                        </P>

                      </Message.Body>
                    </Message>

                    <Field>
                      <Control>
                        <Button
                          isLoading={isSendingVerification}
                          isOutlined
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

            {emailNotVerifiedError ? null : (
              <Box>
                <P hasTextCentered>
                  <FormattedMessage id="EnterPage.new-user.message" /> &nbsp;

                  <A onClick={this.onClickCreateAccount}>
                    <FormattedMessage id="EnterPage.new-user.action" />
                  </A>
                </P>
              </Box>
            )}
          </Column>
        </Modal.Content>
      </Modal>
    )
  }
}

const mapStateToProps = ({
  account: {
    authentication,
    email,
    emailVericationSent,
    error,
    isEntering,
    isSendingVerification,
  }
}) => ({
  authentication,
  emailVericationSent,
  errorCode: error && error.code,
  hasNoEmail: email === "",
  isEntering,
  isSendingVerification,
})

const mapDispatchToProps = (dispatch) => ({
  cleanupAuthenticationError: () => dispatch(cleanupAuthenticationError()),
  enterAccount: (credentials) => dispatch(enterAccount(credentials)),
  sendVerification: (email) => dispatch(sendVerification(email)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EnterPage)
