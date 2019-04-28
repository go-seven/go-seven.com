import { ticTacToe } from "i-am-not-a-robot"
import * as pdsp from "pdsp"
import * as React from "react"
import { connect } from "react-redux"
import { Redirect } from "react-router-dom"
import {
  Box,
  Button,
  Checkbox,
  Column,
  Content,
  Control,
  Field,
  Image,
  Media,
  Message,
  Modal,
  Section,
  Title,
} from "trunx"

import * as apiError from "../apiErrors"

import EmailField from "../components/EmailField"
import Logo from "../components/Logo"
import PasswordField from "../components/PasswordField"

import {
  createAccount,
  resetAuthenticationError,
  IAuthentication,
  ICredentials,
} from "../reducers/account"

import HomePage from "./HomePage"
import PrivacyPolicyPage from "./PrivacyPolicyPage"
import TermsOfServicePage from "./TermsOfServicePage"

interface IProps {
  authentication: IAuthentication
  createAccount: (ICredentials) => void
  isCreatingAccount: boolean
  resetAuthenticationError: () => void
}

interface IState {
  clientAgrees: boolean
  clientIsRobot: boolean
  redirect?: string
}

class CreateAccountPage extends React.Component<IProps, IState> {
  static path = "/create-account"

  state: IState = {
    clientAgrees: false,
    clientIsRobot: true,
  }

  private antispamRef = React.createRef<HTMLInputElement>()
  private emailRef = React.createRef<HTMLInputElement>()
  private passwordRef = React.createRef<HTMLInputElement>()

  componentDidMount() {
    const {
      resetAuthenticationError,
    } = this.props

    resetAuthenticationError()
  }

  loadAntiSpam() {
    const {
      clientIsRobot
    } = this.state

    if (clientIsRobot) {
      ticTacToe(this.antispamRef.current, () => {
        this.setState({ clientIsRobot: false })
      })
    }
  }

  onChangeCheckbox = (event) => {
    const {
      clientIsRobot
    } = this.state

    this.setState({
      clientAgrees: event.target.checked
      }, () => {
        this.loadAntiSpam()
      })
  }

  onClickLogo = (event) => {
    this.setState({
      redirect: HomePage.path
    })
  }

  onSubmit = (event) => {
    pdsp(event)

    const email = this.emailRef.current && this.emailRef.current.value
    const password = this.passwordRef.current && this.passwordRef.current.value

    this.props.createAccount({ email, password })
  }

  render() {
    const {
      authentication,
      isCreatingAccount,
    } = this.props

    const {
      clientAgrees,
      clientIsRobot,
      redirect,
    } = this.state

    if (authentication === null) {
      return null
    }

    if (redirect) {
      return (
        <Redirect push to={redirect} />
      )
    }

    const error = authentication.error || { code: "", message: "" }
    const emailFieldError = error.code === apiError.AccountNotFoundError ? error.message : undefined
    const passwordFieldError = error.code === apiError.InvalidPasswordError ? error.message : undefined

    return (
      <Modal isActive>
        <Modal.Background />

        <Modal.Content>
          <Column>
            <Box>
              <Media>
                <Media.Left>
                  <Image onClick={this.onClickLogo} width="28" height="28" src="media/logo.svg" />
                </Media.Left>

                <Media.Content>
                  <Content hasTextCentered>
                    <Title is4 hasTextGrey>Create a GoSeven account</Title>
                  </Content>
                </Media.Content>
              </Media>

              <Section
                isSrOnly={clientIsRobot && clientAgrees}
              >
                <form
                  autoComplete="off"
                  onSubmit={this.onSubmit}
                >
                  <EmailField
                    errorMessage={emailFieldError}
                    inputRef={this.emailRef}
                  />

                  <PasswordField
                    autoComplete="new-password"
                    canShowPassword
                    errorMessage={passwordFieldError}
                    inputRef={this.passwordRef}
                    showPasswordPolicy
                  />

                  <Field>
                    <Control>
                      <Checkbox
                        onChange={this.onChangeCheckbox}
                      >
                        I agree to the <a href={PrivacyPolicyPage.path} target="_blank">Privacy Policy</a> and to the <a href={TermsOfServicePage.path} target="_blank">Terms of Service</a>.
                      </Checkbox>
                    </Control>
                  </Field>

                  <Field>
                    <Control>
                      <Button
                        disabled={!clientAgrees}
                        isLoading={isCreatingAccount}
                        isSuccess
                        isSrOnly={clientIsRobot}
                        type="submit"
                        value="Create an account"
                      />
                    </Control>
                  </Field>
                </form>
              </Section>

              {clientIsRobot && (
                <Section
                  isSrOnly={!clientAgrees}
                >
                  <Message isMedium>
                    <Message.Header>
                      <p>
                        Are you a <strong>robot</strong>?
                      </p>
                    </Message.Header>

                    <Message.Body>
                      <p className="has-text-centered">
                        Play <em>tic tac toe</em> !
                      </p>

                      <div ref={this.antispamRef} />
                    </Message.Body>
                  </Message>
                </Section>
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
  isCreatingAccount: state.account.isCreating,
})

const mapDispatchToProps = (dispatch) => ({
  createAccount: (credentials) => dispatch(createAccount(credentials)),
  resetAuthenticationError: () => dispatch(resetAuthenticationError),
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateAccountPage)
