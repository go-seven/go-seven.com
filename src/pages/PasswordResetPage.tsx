import pdsp from 'pdsp'
import * as React from 'react'
import { useRef } from 'react'
import { FormattedMessage } from 'react-intl'
import InjectIntl from 'react-intl-inject'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { bindActionCreators } from 'redux'
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
  Title
} from 'trunx'

import * as api from '../api'

import EmailField from '../components/EmailField'
import LogoButton from '../components/LogoButton'

import translationKey from '../i18n/translationKeys'

import MyUrlsPage from './MyUrlsPage'

import {
  sendPasswordReset
} from '../reducers/account'

function PasswordResetPage ({
  authenticationIsValid,
  isSendingPasswordReset,
  errorCode,
  passwordResetEmailSent,
  sendPasswordReset,
}) {
  const emailRef = useRef<HTMLInputElement>()

  if (!authenticationIsValid) {
    return (
      <Redirect push to={MyUrlsPage.path} />
    )
  }

  const emailFieldError = errorCode === api.error.EmailNotFoundError

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
                    <FormattedMessage id={'PasswordResetPage.title'} />
                  </Title>
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
                onSubmit={(event) => {
                  pdsp(event)

                  const email = emailRef.current!.value

                  if (typeof email === 'string') {
                    sendPasswordReset(email)
                  }
                }}
              >
                <InjectIntl>
                  {({ intl }) => (
                    <EmailField
                      errorMessage={emailFieldError && intl.formatMessage({ id: translationKey.page.PasswordReset.email.errorMessageByCode(errorCode) })}
                      inputRef={this.emailRef}
                    />
                  )}
                </InjectIntl>
                <Field>
                  <Control>
                    <InjectIntl>
                      {({ intl }) => (
                        <Button
                          isLoading={isSendingPasswordReset}
                          isSuccess
                          type="submit"
                          value={intl.formatMessage({ id: 'PasswordResetPage.send' })}
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

const mapStateToProps = ({
  account: {
    authentication,
    error,
    isSendingPasswordReset,
    passwordResetEmailSent
  }
}) => ({
  authenticationIsValid: authentication === null ? false : authentication.isValid,
  errorCode: error?.code,
  isSendingPasswordReset,
  passwordResetEmailSent
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  sendPasswordReset
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PasswordResetPage)
