import { ticTacToe } from 'i-am-not-a-robot'
import pdsp from 'pdsp'
import * as React from 'react'
import { useEffect, useState, useRef } from 'react'
import { FormattedMessage } from 'react-intl'
import InjectIntl from 'react-intl-inject'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { bindActionCreators } from 'redux'
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

import * as api from '../api'

import { EmailField } from '../components/EmailField'
import LogoButton from '../components/LogoButton'
import PasswordField from '../components/PasswordField'
import PleaseLookForVerificationEmail from '../components/PleaseLookForVerificationEmail'

import {
  cleanupAuthenticationError,
  createAccount,
} from '../reducers/account'

import pagePath from './paths'

function CreateAccountPage ({
  authenticationIsValid,
  cleanupAuthenticationError,
  createAccount,
  errorCode,
  isCreating,
  justCreated,
}) {
  const [antiSpamLoaded, setAntiSpamLoaded] = useState(false)
  const [clientAgrees, setClientAgrees] = useState(false)
  const [clientIsRobot, setClientIsRobot] = useState(true)
  const [passwordIsValid, setPasswordIsValid] = useState(false)
  const [redirect, setRedirect] = useState('')

  const antiSpamRef = useRef<HTMLInputElement>()
  const emailRef = useRef<HTMLInputElement>()
  const passwordRef = useRef<HTMLInputElement>()

  useEffect(() => {
    cleanupAuthenticationError()
  }, [cleanupAuthenticationError])

  if (authenticationIsValid) {
    setRedirect(pagePath.myUrls())
  }

  if (redirect) {
    return (
      <Redirect push to={redirect} />
    )
  }

  const emailExistsError = errorCode === api.error.EmailExistsError
  const invalidPasswordError = errorCode === api.error.InvalidPasswordError

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
                onSubmit={(event) => {
                  pdsp(event)

                  const email = emailRef.current!.value
                  const password = passwordRef.current!.value

                  createAccount({ email, password })
                }}
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
                      setPasswordIsValid={setPasswordIsValid}
                      showPasswordPolicy
                    />
                  )}
                </InjectIntl>
                <Field>
                  <Control>
                    <Checkbox
                      onChange={(event) => {
                        setClientAgrees(event.target.checked)

                        if (clientIsRobot && !antiSpamLoaded) {
                          setAntiSpamLoaded(true)

                          ticTacToe(
                            antiSpamRef.current,
                            () => setClientIsRobot(false)
                          )
                        }
                      }}
                    >
                      I agree to the <a href={pagePath.privacyPolicy()} target="_blank">Privacy Policy</a> and to the <a href={pagePath.termsOfService()} target="_blank">Terms of Service</a>.
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

const mapStateToProps = ({
  account: {
    authentication,
    error,
    isCreating,
    justCreated
  }
}) => ({
  authenticationIsValid: authentication === null ? false : authentication.isValid,
  errorCode: error?.code,
  isCreating,
  justCreated
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  cleanupAuthenticationError,
  createAccount,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CreateAccountPage)
