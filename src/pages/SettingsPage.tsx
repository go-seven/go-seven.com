import * as React from 'react'
import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import {
  Box,
  Button,
  Buttons,
  Column,
  Container,
  Modal,
  Notification,
  Section,
  Title
} from 'trunx'

import ChangePasswordForm from '../components/ChangePasswordForm'
import Navbar from '../components/Navbar'

import pagePath from './paths'

import {
  changePassword,
  deleteAccount,
  exitAccount
} from '../reducers/account'

function SettingsPage ({
  authenticationIsValid,
  changePassword,
  deleteAccount,
  exitAccount,
  isChangingPassword,
  isDeletingAccount,
  justDeletedAccount
}) {
  const [askingAccountDeletionConfirmation, setAskingAccountDeletionConfirmation] = useState(false)
  const [redirect, setRedirect] = useState('')

  useEffect(() => {
    if (!authenticationIsValid) {
      setRedirect(pagePath.home())
    }
  }, [authenticationIsValid, setRedirect])

  if (authenticationIsValid === null) {
    return null
  }

  if (redirect) {
    return (
      <Redirect push to={redirect}/>
    )
  }

  if (justDeletedAccount) {
    return (
      <Modal isActive>
        <Modal.Background />

        <Notification>
          <FormattedMessage id="SettingsPage.account-deletion-confirmation.goodbye" />
        </Notification>
      </Modal>
    )
  }

  if (askingAccountDeletionConfirmation) {
    return (
      <Modal isActive>
        <Modal.Background
          onClick={() => setAskingAccountDeletionConfirmation(false)}
        />

        <Modal.Close isLarge />

        <Modal.Content>
          <Column>
            <Notification isDanger>
              <FormattedMessage id="SettingsPage.account-deletion-confirmation.message" />
            </Notification>

            <Buttons>
              <Button
                onClick={() => setAskingAccountDeletionConfirmation(false)}
              >
                <FormattedMessage id="SettingsPage.account-deletion-confirmation.cancel" />
              </Button>

              <Button
                isDanger
                isLoading={isDeletingAccount}
                isOutlined
                onClick={() => deleteAccount()}
              >
                <FormattedMessage id="SettingsPage.account-deletion-confirmation.submit" />
              </Button>
            </Buttons>
          </Column>
        </Modal.Content>
      </Modal>
    )
  }

  return (
    <>
      <Navbar
        authenticationIsValid={authenticationIsValid}
        exit={exitAccount}
      />

      <Section>
        <Container>
          <Title>
            <FormattedMessage id="SettingsPage.title" />
          </Title>

          <Box>
            <ChangePasswordForm
              changePassword={changePassword}
              isChangingPassword={isChangingPassword}
            />
          </Box>
        </Container>
      </Section>

      <Section>
        <Container>
          <Button
            isDanger
            isLoading={isDeletingAccount}
            onClick={() => setAskingAccountDeletionConfirmation(true)}
          >
            <FormattedMessage id="SettingsPage.account-deletion.button" />
          </Button>
        </Container>
      </Section>
    </>
  )
}

const mapStateToProps = ({
  account: {
    authentication,
    isChangingPassword,
    isDeleting,
    justDeleted
  }
}) => ({
  authenticationIsValid: authentication === null ? null : authentication.isValid,
  isChangingPassword,
  isDeletingAccount: isDeleting,
  justDeletedAccount: justDeleted
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  changePassword,
  deleteAccount,
  exitAccount,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage)
