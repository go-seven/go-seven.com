import * as eye from "fa-svg-icon/regular/eye"
import * as eyeSlash from "fa-svg-icon/regular/eye-slash"
import * as lock from "fa-svg-icon/solid/lock"
import * as pdsp from "pdsp"
import * as React from "react"
import { FormattedMessage } from "react-intl"
import {
  Control,
  Field,
  Help,
  Icon,
  Input,
  Label,
  Span,
} from "trunx"

import PasswordResetPage from "../pages/PasswordResetPage"

interface IProps {
  autoComplete?: string
  canShowPassword?: boolean
  errorMessage?: string,
  inputRef: React.RefObject<HTMLInputElement>
  showForgotPassword?: boolean
  showPasswordPolicy?: boolean
}

interface IPasswordPolicyChecks {
  hasLowercase: boolean
  hasUppercase: boolean
  hasNumber: boolean
  isLongEnough: boolean
}

interface IState {
  passwordIsVisible: boolean
  passwordCheck: IPasswordPolicyChecks
}

export default class PasswordField extends React.Component<IProps, IState> {
  static minLenght = 8

  state: IState = {
    passwordCheck: {
      hasLowercase: false,
      hasNumber: false,
      hasUppercase: false,
      isLongEnough: false,
    },
    passwordIsVisible: false,
  }

  checkPasswordPolicy(): IPasswordPolicyChecks {
    const password = this.props.inputRef.current!.value

    const hasLowercase = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasUppercase = /[A-Z]/.test(password)
    const isLongEnough = password.length >= PasswordField.minLenght

    return {
      hasLowercase,
      hasNumber,
      hasUppercase,
      isLongEnough,
    }
  }

  onChange = () => {
    const passwordCheck = this.checkPasswordPolicy()

    this.setState({ passwordCheck })
  }

  togglePasswordVisibility = (event) => {
    pdsp(event)

    this.setState({
      passwordIsVisible: !this.state.passwordIsVisible
    })
  }

  render() {
    const {
      autoComplete,
      canShowPassword,
      errorMessage,
      inputRef,
      showForgotPassword,
      showPasswordPolicy,
    } = this.props

    const {
      passwordCheck,
      passwordIsVisible,
    } = this.state

    const {
      hasLowercase,
      hasNumber,
      hasUppercase,
      isLongEnough,
    } = passwordCheck

    return (
      <Field>
        <Label>
          Password

          {showForgotPassword && (
            <a
              className="is-pulled-right"
              href={PasswordResetPage.path}
            >
              <FormattedMessage id="PasswordField.forgot-password.message"/>
            </a>
          )}
        </Label>

        <Control hasIconsLeft hasIconsRight={canShowPassword}>
          <Input
            autoComplete={autoComplete}
            inputRef={inputRef}
            isDanger={!!errorMessage}
            isWarning={passwordIsVisible}
            onChange={this.onChange}
            required
            type={passwordIsVisible ? "text" : "password"}
          />

          <Icon hasTextGrey isLeft>
            <Icon.Svg icon={lock} />
          </Icon>

          {canShowPassword && (
            <Icon
              hasBackgroundWhiteTer={!passwordIsVisible}
              hasBackgroundWarning={passwordIsVisible}
              hasTextLight={passwordIsVisible}
              hasTextGrey={!passwordIsVisible}
              isRight
              onClick={this.togglePasswordVisibility}
            >
              <Icon.Svg icon={passwordIsVisible ? eyeSlash : eye} />
            </Icon>
          )}

          {errorMessage && (
            <Help>
              <Span hasTextDanger>{errorMessage}</Span>
            </Help>
          )}

          {showPasswordPolicy && (
            <Help>
              <Span hasTextSuccess={isLongEnough}>{PasswordField.minLenght} chars</Span>
              <Span hasTextSuccess={isLongEnough && hasNumber}>&nbsp;&bull;&nbsp;</Span>
              <Span hasTextSuccess={hasNumber}>number</Span>
              <Span hasTextSuccess={hasNumber && hasUppercase}>&nbsp;&bull;&nbsp;</Span>
              <Span hasTextSuccess={hasUppercase}>uppercase</Span>
              <Span hasTextSuccess={hasUppercase && hasLowercase}>&nbsp;&bull;&nbsp;</Span>
              <Span hasTextSuccess={hasLowercase}>lowercase</Span>
            </Help>
          )}
        </Control>
      </Field>
    )
  }
}
