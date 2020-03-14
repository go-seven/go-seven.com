import pdsp from 'pdsp'
import * as React from 'react'
import InjectIntl from 'react-intl-inject'
import {
  Button,
  Control,
  Field
} from 'trunx'

import { IChangePasswordPayload } from '../api'

import PasswordField from './PasswordField'

interface IProps {
  changePassword: ({ password }: IChangePasswordPayload) => void
  isChangingPassword: boolean
}

export default function ChangePasswordForm ({
  changePassword,
  isChangingPassword
}: IProps) {
  const passwordRef = React.useRef<HTMLInputElement>()

  const [passwordIsValid, setPasswordIsValid] = React.useState(false)

  return (
    <form
      autoComplete="off"
      onSubmit={(event) => {
        pdsp(event)

        const password = passwordRef.current!.value

        if (typeof password === 'string') {
          changePassword({ password })
        }
      }}
    >
      <InjectIntl>
        {({ intl }) => (
          <PasswordField
            autoComplete="off"
            inputRef={this.passwordRef}
            label={intl.formatMessage({ id: 'ChangePasswordForm.new-password.label' })}
            setPasswordIsValid={setPasswordIsValid}
            showPasswordPolicy
            visible
          />
        )}
      </InjectIntl>

      <Field>
        <Control>
          <InjectIntl>
            {({ intl }) => (
              <Button
                disabled={!passwordIsValid}
                isLoading={isChangingPassword}
                isSuccess
                type="submit"
                value={intl.formatMessage({ id: 'ChangePasswordForm.submit' })}
              />
            )}
          </InjectIntl>
        </Control>
      </Field>
    </form>
  )
}
