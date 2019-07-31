import * as pdsp from "pdsp"
import * as React from "react"
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
        <PasswordField
          autoComplete="off"
          inputRef={this.passwordRef}
          setPasswordIsValid={this.setPasswordIsValid}
          showPasswordPolicy
          visible
        />

        <Field>
          <Control>
            <Button
              disabled={!passwordIsValid}
              isLoading={isChangingPassword}
              isSuccess
              type="submit"
              value="Change password"
            />
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
