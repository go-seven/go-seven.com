import * as React from "react"
import {
  Button,
  Control,
  Field,
} from "trunx"

import PasswordField from "./PasswordField"

interface IProps {
  isChangingPassword: boolean
}

export default class ChangePasswordForm extends React.Component<IProps> {
  private passwordRef = React.createRef<HTMLInputElement>()

  render() {
    const {
      isChangingPassword
    } = this.props

    return (
      <form>
        <PasswordField
          inputRef={this.passwordRef}
        />

        <Field>
          <Control>
            <Button
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
}
