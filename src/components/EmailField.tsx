import * as envelope from "fa-svg-icon/solid/envelope"
import * as React from "react"
import {
  Control,
  Field,
  Icon,
  Input,
  Label,
} from "trunx"

interface IProps {
  inputRef?: React.RefObject<HTMLInputElement>
}

export default class EmailField extends React.Component<IProps> {
  render() {
    const {
      inputRef
    } = this.props

    return (
      <Field>
        <Label>Email</Label>

        <Control hasIconsLeft>
          <Input
            inputRef={inputRef}
            required
            type="email"
          />

          <Icon isLeft>
            <Icon.Svg icon={envelope} />
          </Icon>
        </Control>
      </Field>
    )
  }
}
