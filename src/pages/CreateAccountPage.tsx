import { ticTacToe } from 'i-am-not-a-robot'
import pdsp from 'pdsp'
import * as React from 'react'
import { FormattedMessage } from 'react-intl'
import InjectIntl from 'react-intl-inject'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
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
  Title
} from 'trunx'

import * as apiError from '../apiErrors'

import EmailField from '../components/EmailField'
import LogoButton from '../components/LogoButton'
import PasswordField from '../components/PasswordField'
import PleaseLookForVerificationEmail from '../components/PleaseLookForVerificationEmail'

import {
  cleanupAuthenticationError,
  createAccount,
  ICredentials
} from '../reducers/account'

import MyUrlsPage from './MyUrlsPage'
import PrivacyPolicyPage from './PrivacyPolicyPage'
import TermsOfServicePage from './TermsOfServicePage'

interface IProps {
  authenticationIsValid: boolean
  cleanupAuthenticationError: () => void
  createAccount: (ICredentials) => void
  errorCode?: string
  isCreating: boolean
  justCreated: boolean
}

interface IState {
  antiSpamLoaded: boolean
  clientAgrees: boolean
  clientIsRobot: boolean
  passwordIsValid: boolean
  redirect?: string
}

class CreateAccountPage extends React.Component<IProps, IState> {
  static path = '/create-account'

  state: IState = {
    antiSpamLoaded: false,
    clientAgrees: false,
    clientIsRobot: true,
    passwordIsValid: false
  }

  private readonly antiSpamRef = React.createRef<HTMLInputElement>()

  private readonly emailRef = React.createRef<HTMLInputElement>()

  private readonly passwordRef = React.createRef<HTMLInputElement>()

  componentDidMount () {
    this.props.cleanupAuthenticationError()
  }

  loadAntiSpam () {
    const {
      antiSpamLoaded,
      clientIsRobot
    } = this.state

    if (clientIsRobot && !antiSpamLoaded) {
      this.setState({ antiSpamLoaded: true }, () => {
        ticTacToe(this.antiSpamRef.current, () => {
          this.setState({ clientIsRobot: false })
        })
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

    const email = this.emailRef.current!.value
    const password = this.passwordRef.current!.value

    this.props.createAccount({ email, password })
  }

  render () {
    const {
      authenticationIsValid,
      errorCode,
      isCreating,
      justCreated
    } = this.props

    const {
      clientAgrees,
      clientIsRobot,
      passwordIsValid,
      redirect
    } = this.state

    if (authenticationIsValid) {
      return (
        <Redirect push to={MyUrlsPage.path} />
      )
    }

    if (redirect) {
      return (
        <Redirect push to={redirect} />
      )
    }

    const emailExistsError = errorCode === apiError.EmailExistsError
    const invalidPasswordError = errorCode === apiError.InvalidPasswordError

    if (justCreated) {
      return (
        <Modal isActive>
          <Modal.Background />

          <Modal.Content>
            <Message isSuccess>
              <Message.Header>
                <FormattedMessage id="CreateAccountPage.account-created" />
              </Message.Header>

              <Message.Body>
                <PleaseLookForVerificationEmail />
              </Message.Body>
            </Message>
          </Modal.Content>
        </Modal>
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
                    <Title is4 hasTextGrey>
                      <FormattedMessage id="CreateAccountPage.title" />
                    </Title>
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
                        errorMessage={emailExistsError && intl.formatMessage({ id: 'CreateAccountPage.email.emailExistsError' })}
                        inputRef={this.emailRef}
                      />
                    )}
                  </InjectIntl>

                  <InjectIntl>
                    {({ intl }) => (
                      <PasswordField
                        autoComplete="new-password"
                        errorMessage={invalidPasswordError && intl.formatMessage({ id: 'CreateAccountPage.password.InvalidPasswordError' })}
                        inputRef={this.passwordRef}
                        label={intl.formatMessage({ id: 'CreateAccountPage.password.label' })}
                        setPasswordIsValid={this.setPasswordIsValid}
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
                        disabled={!clientAgrees || !passwordIsValid}
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

                      <div ref={this.antiSpamRef} />
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

  setPasswordIsValid = (passwordIsValid) => {
    this.setState({
      passwordIsValid
    })
  }
}

const mapStateToProps = ({
  account: {
    authentication,
    error,
    isCreating,
    justCreated
  }
}) => ({
  authenticationIsValid: authentication === null ? false : authentication.isValid,
  errorCode: error && error.code,
  isCreating,
  justCreated
})

const mapDispatchToProps = (dispatch) => ({
  cleanupAuthenticationError: () => dispatch(cleanupAuthenticationError),
  createAccount: (credentials) => dispatch(createAccount(credentials))
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateAccountPage)
