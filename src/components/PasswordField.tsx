import * as lock from "fa-svg-icon/solid/lock"
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

export default class PasswordField extends React.Component<IProps> {
  render() {
    const {
      autoComplete,
      inputRef,
    } = this.props

    return (
      <Field>
        <Label>Password</Label>

        <Control hasIconsLeft>
          <Input
            autoComplete={autoComplete}
            inputRef={inputRef}
            type="password"
          />

          <Icon isLeft>
            <Icon.Svg icon={lock} />
          </Icon>
        </Control>
      </Field>
    )
  }
}
