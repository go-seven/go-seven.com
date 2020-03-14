import pdsp from 'pdsp'
import * as React from 'react'
import { useEffect, useState, useRef } from 'react'
import { FormattedMessage } from 'react-intl'
import InjectIntl from 'react-intl-inject'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import {
  A,
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
  Title
} from 'trunx'

import * as api from '../api'
import { ISendVerificationPayload } from '../api'

import EmailField from '../components/EmailField'
import LogoButton from '../components/LogoButton'
import PasswordField from '../components/PasswordField'
import PleaseLookForVerificationEmail from '../components/PleaseLookForVerificationEmail'

import {
  cleanupAuthenticationError,
  enterAccount,
  sendVerification,
} from '../reducers/account'

import pagePath from './paths'

interface IProps {
  authenticationIsValid: boolean
  cleanupAuthenticationError: () => void
  emailVericationSent: boolean
  enterAccount: (ICredentials) => void
  errorCode?: string
  isEntering: boolean
  isSendingVerification: boolean
  sendVerification: (ISendVerificationPayload) => void
}

function EnterPage ({
  authenticationIsValid,
  enterAccount,
  emailVericationSent,
  errorCode,
  isEntering,
  isSendingVerification,
  sendVerification,
}: IProps) {
  const emailRef = useRef<HTMLInputElement>()
  const passwordRef = useRef<HTMLInputElement>()

  const [redirect, setRedirect] = useState('')

  useEffect(() => {
    cleanupAuthenticationError()
  }, [cleanupAuthenticationError])

  useEffect(() => {
    if (authenticationIsValid) {
      setRedirect(pagePath.myUrls())
    }
  }, [authenticationIsValid, setRedirect])

  if (redirect) {
    return (
      <Redirect push to={redirect} />
    )
  }

  const emailNotFoundError = errorCode === api.error.EmailNotFoundError
  const invalidPasswordError = errorCode === api.error.InvalidPasswordError
  const emailNotVerifiedError = errorCode === api.error.EmailNotVerifiedError

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
                      <FormattedMessage id={'EnterPage.title'} />
                    </Title>
                  </Content>
                </Media.Content>
              </Media>

              <form
                autoComplete="on"
                onSubmit={(event) => {
                  pdsp(event)

                  const email = emailRef.current!.value
                  const password = passwordRef.current!.value

                  enterAccount({ email, password })
                }}
              >
                <InjectIntl>
                  {({ intl }) => (
                    <EmailField
                      errorMessage={emailNotFoundError && intl.formatMessage({ id: 'EnterPage.email.emailNotFoundError' })}
                      inputRef={emailRef}
                    />
                  )}
                </InjectIntl>

                <InjectIntl>
                  {({ intl }) => (
                    <PasswordField
                      autoComplete="current-password"
                      errorMessage={invalidPasswordError ? (intl.formatMessage({ id: 'EnterPage.password.invalidPasswordError' }) as string) : undefined}
                      inputRef={this.passwordRef}
                      label={(intl.formatMessage({ id: 'EnterPage.password.label' }) as string)}
                      showForgotPassword
                    />
                  )}
                </InjectIntl>

                <InjectIntl>
                  {({ intl }) => (
                    <Field>
                      <Control>
                        <Button
                          isLoading={isEntering}
                          isSuccess
                          type="submit"
                          value={intl.formatMessage({ id: 'EnterPage.submit' })}
                        />
                      </Control>
                    </Field>
                  )}
                </InjectIntl>
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
                      <FormattedMessage id="EnterPage.account-not-verified.title" />
                    </Message.Header>

                    <Message.Body>
                      <P>
                        <PleaseLookForVerificationEmail />
                      </P>

                    </Message.Body>
                  </Message>

                  <Field>
                    <Control>
                      <Button
                        isLoading={isSendingVerification}
                        isOutlined
                        isWarning
                        onClick={(event) => {
                          pdsp(event)

                          const email = emailRef.current!.value

                          if (typeof email === 'string') {
                            sendVerification({ email })
                          }
                        }}
                      >
                        <FormattedMessage id="EnterPage.account-not-verified.resend-email" />
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

                <A
                  onClick={() => setRedirect(pagePath.createAccount())}
                >
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

const mapStateToProps = ({
  account: {
    authentication,
    email,
    emailVericationSent,
    error,
    isEntering,
    isSendingVerification
  }
}) => ({
  authenticationIsValid: authentication === null ? false : authentication.isValid,
  emailVericationSent,
  errorCode: error?.code,
  hasNoEmail: email === '',
  isEntering,
  isSendingVerification
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  cleanupAuthenticationError,
  enterAccount,
  sendVerification,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(EnterPage)
