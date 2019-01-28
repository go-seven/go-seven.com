import * as eye from "fa-svg-icon/regular/eye"
import * as eyeSlash from "fa-svg-icon/regular/eye-slash"
import * as lock from "fa-svg-icon/solid/lock"
import * as pdsp from "pdsp"
import * as React from "react"
import {
  Control,
  Field,
  Help,
  Icon,
  Input,
  Label,
} from "trunx"

interface IProps {
  autoComplete?: string
  inputRef: React.RefObject<HTMLInputElement>
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
    const isLongEnough = password.length >= 8

    return {
      hasLowercase,
      hasNumber,
      hasUppercase,
      isLongEnough,
    }
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
      inputRef,
    } = this.props

    const {
      passwordCheck,
      passwordIsVisible,
    } = this.state

    return (
      <Field>
        <Label>Password</Label>

        <Control hasIconsLeft hasIconsRight>
          <Help>
            <span>8 chars</span>
            <span>&nbsp;&bull;&nbsp;</span>
            <span>number</span>
            <span>&nbsp;&bull;&nbsp;</span>
            <span>uppercase</span>
            <span>&nbsp;&bull;&nbsp;</span>
            <span>lowercase</span>
          </Help>

          <Input
            autoComplete={autoComplete}
            inputRef={inputRef}
            isDanger={passwordIsVisible}
            required
            type={passwordIsVisible ? "text" : "password"}
          />

          <Icon isLeft>
            <Icon.Svg icon={lock} />
          </Icon>

          <Icon
            hasBackgroundWhiteTer={!passwordIsVisible}
            hasBackgroundDanger={passwordIsVisible}
            hasTextLight={passwordIsVisible}
            hasTextGrey={!passwordIsVisible}
            isRight
            onClick={this.togglePasswordVisibility}
          >
            <Icon.Svg icon={passwordIsVisible ? eyeSlash : eye} />
          </Icon>
        </Control>
      </Field>
    )
  }
}
