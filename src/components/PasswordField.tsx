import * as lock from 'fa-svg-icon/solid/lock'
import * as React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  A,
  Control,
  Field,
  Help,
  Icon,
  Input,
  Label,
  Span
} from 'trunx'

import PasswordResetPage from '../pages/PasswordResetPage'

interface IProps {
  autoComplete?: string
  errorMessage?: string
  inputRef: React.RefObject<HTMLInputElement>
  label?: string
  setPasswordIsValid: (passwordIsValid: boolean) => void
  showForgotPassword?: boolean
  showPasswordPolicy?: boolean
  visible: boolean
}

interface IPasswordPolicyChecks {
  hasLowercase: boolean
  hasUppercase: boolean
  hasNumber: boolean
  isLongEnough: boolean
}

interface IState {
  passwordCheck: IPasswordPolicyChecks
}

export default class PasswordField extends React.Component<IProps, IState> {
  static defaultProps = {
    setPasswordIsValid: Function.prototype,
    visible: false
  }

  static minLenght = 8

  state: IState = {
    passwordCheck: {
      hasLowercase: false,
      hasNumber: false,
      hasUppercase: false,
      isLongEnough: false
    }
  }

  checkPasswordPolicy (): IPasswordPolicyChecks {
    const password = this.props.inputRef.current!.value

    const hasLowercase = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasUppercase = /[A-Z]/.test(password)
    const isLongEnough = password.length >= PasswordField.minLenght

    this.props.setPasswordIsValid(hasLowercase && hasNumber && hasUppercase && isLongEnough)

    return {
      hasLowercase,
      hasNumber,
      hasUppercase,
      isLongEnough
    }
  }

  onChange = () => {
    const passwordCheck = this.checkPasswordPolicy()

    this.setState({ passwordCheck })
  }

  render () {
    const {
      autoComplete,
      errorMessage,
      inputRef,
      label,
      showForgotPassword,
      showPasswordPolicy,
      visible
    } = this.props

    const {
      passwordCheck: {
        hasLowercase,
        hasNumber,
        hasUppercase,
        isLongEnough
      }
    } = this.state

    return (
      <Field>
        <Label>
          {label}

          {showForgotPassword && (
            <A
              href={PasswordResetPage.path}
              isPulledRight
              tabIndex={-1}
            >
              <FormattedMessage id="PasswordField.forgot-password.message"/>
            </A>
          )}
        </Label>

        <Control hasIconsLeft>
          <Input
            autoComplete={autoComplete}
            inputRef={inputRef}
            isDanger={!!errorMessage}
            onChange={this.onChange}
            required
            type={visible ? 'text' : 'password'}
          />

          <Icon hasTextGrey isLeft>
            <Icon.Svg icon={lock} />
          </Icon>

          {errorMessage && (
            <Help>
              <Span hasTextDanger>{errorMessage}</Span>
            </Help>
          )}

          {showPasswordPolicy && (
            <Help>
              <Span hasTextSuccess={isLongEnough}>
                {PasswordField.minLenght}
                &nbsp;
                <FormattedMessage id="PasswordField.policy.chars" />
              </Span>

              <Span hasTextSuccess={isLongEnough && hasNumber}>&nbsp;&bull;&nbsp;</Span>

              <Span hasTextSuccess={hasNumber}>
                <FormattedMessage id="PasswordField.policy.number" />
              </Span>

              <Span hasTextSuccess={hasNumber && hasUppercase}>&nbsp;&bull;&nbsp;</Span>

              <Span hasTextSuccess={hasUppercase}>
                <FormattedMessage id="PasswordField.policy.uppercase" />
              </Span>

              <Span hasTextSuccess={hasUppercase && hasLowercase}>&nbsp;&bull;&nbsp;</Span>

              <Span hasTextSuccess={hasLowercase}>
                <FormattedMessage id="PasswordField.policy.lowercase" />
              </Span>
            </Help>
          )}
        </Control>
      </Field>
    )
  }
}
