import * as eye from "fa-svg-icon/regular/eye"
import * as eyeSlash from "fa-svg-icon/regular/eye-slash"
import * as lock from "fa-svg-icon/solid/lock"
import * as pdsp from "pdsp"
import * as React from "react"
import {
  Control,
  Field,
  Icon,
  Input,
  Label,
} from "trunx"

interface IProps {
  autoComplete?: string
  inputRef: React.RefObject<HTMLInputElement>
}

interface IState {
  passwordIsVisible: boolean
}

export default class PasswordField extends React.Component<IProps, IState> {
  state = {
    passwordIsVisible: false
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
      passwordIsVisible,
    } = this.state

    return (
      <Field>
        <Label>Password</Label>

        <Control hasIconsLeft hasIconsRight>
          <Input
            autoComplete={autoComplete}
            inputRef={inputRef}
            isDanger={passwordIsVisible}
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
