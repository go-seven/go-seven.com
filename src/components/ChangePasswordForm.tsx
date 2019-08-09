import * as pdsp from "pdsp"
import * as React from "react"
import InjectIntl from "react-intl-inject"
import {
  Button,
  Control,
  Field,
} from "trunx"

import PasswordField from "./PasswordField"

export interface IChangePasswordFormProps {
  changePassword: (password: string) => void
  isChangingPassword: boolean
}

interface IState {
  passwordIsValid: boolean
}

export default class ChangePasswordForm extends React.Component<IChangePasswordFormProps> {
  state: IState = {
    passwordIsValid: false
  }

  private passwordRef = React.createRef<HTMLInputElement>()

  enableSubmit = (canSave) => {
    this.setState({
      passwordIsValid: !canSave
    })
  }

  onSubmit = (event) => {
    pdsp(event)

    const password = this.passwordRef.current!.value

    if (typeof password === "string") {
      this.props.changePassword(password)
    }
  }

  render() {
    const {
      isChangingPassword
    } = this.props

    const {
      passwordIsValid
    } = this.state

    return (
      <form
        autoComplete="off"
        onSubmit={this.onSubmit}
      >
        <InjectIntl>
          {({ intl }) => (
            <PasswordField
              autoComplete="off"
              inputRef={this.passwordRef}
              label={intl.formatMessage({ id: "ChangePasswordForm.new-password.label" })}
              setPasswordIsValid={this.setPasswordIsValid}
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
                  value={intl.formatMessage({ id: "ChangePasswordForm.submit" })}
                />
              )}
            </InjectIntl>
          </Control>
        </Field>
      </form>
    )
  }

  setPasswordIsValid = (passwordIsValid) => {
    this.setState({
      passwordIsValid
    })
  }
}
