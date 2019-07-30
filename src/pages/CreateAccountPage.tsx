import { ticTacToe } from "i-am-not-a-robot"
import * as pdsp from "pdsp"
import * as React from "react"
import InjectIntl from "react-intl-inject"
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
  Media,
  Message,
  Modal,
  P,
  Section,
  Title,
} from "trunx"

import * as apiError from "../apiErrors"

import EmailField from "../components/EmailField"
import LogoButton from "../components/LogoButton"
import PasswordField from "../components/PasswordField"

import {
  cleanupAuthenticationError,
  createAccount,
  IAuthentication,
  ICredentials,
} from "../reducers/account"

import PrivacyPolicyPage from "./PrivacyPolicyPage"
import TermsOfServicePage from "./TermsOfServicePage"

interface IProps {
  authentication: IAuthentication
  cleanupAuthenticationError: () => void
  createAccount: (ICredentials) => void
  errorCode?: string
  isCreating: boolean
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
    this.props.cleanupAuthenticationError()
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
    this.setState({
      clientAgrees: event.target.checked
      }, () => {
        this.loadAntiSpam()
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
      errorCode,
      isCreating,
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

    const emailFieldError = errorCode === apiError.EmailExistsError
    const passwordFieldError = errorCode === apiError.InvalidPasswordError

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
                  <InjectIntl>
                    {({ intl }) => (
                      <EmailField
                        errorMessage={emailFieldError && intl.formatMessage({ id: `CreateAccountPage.email.${errorCode}` })}
                        inputRef={this.emailRef}
                      />
                    )}
                  </InjectIntl>

                  <InjectIntl>
                    {({ intl }) => (
                      <PasswordField
                        autoComplete="new-password"
                        errorMessage={passwordFieldError && intl.formatMessage({ id: `CreateAccountPage.password.${errorCode}` })}
                        inputRef={this.passwordRef}
                        showPasswordPolicy
                      />
                    )}
                  </InjectIntl>
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
                        isLoading={isCreating}
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
                      <P>
                        Are you a <strong>robot</strong>?
                      </P>
                    </Message.Header>

                    <Message.Body>
                      <P hasTextCentered>
                        Play <em>tic tac toe</em> !
                      </P>

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

const mapStateToProps = ({
  account: {
    authentication,
    error,
    isCreating,
  }
}) => ({
  authentication,
  errorCode: error && error.code,
  isCreating,
})

const mapDispatchToProps = (dispatch) => ({
  cleanupAuthenticationError: () => dispatch(cleanupAuthenticationError),
  createAccount: (credentials) => dispatch(createAccount(credentials)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateAccountPage)
