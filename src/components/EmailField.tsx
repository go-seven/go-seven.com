import * as envelope from "fa-svg-icon/solid/envelope"
import * as React from "react"
import {
  Control,
  Field,
  Help,
  Icon,
  Input,
  Label,
  Span,
} from "trunx"

interface IProps {
  errorMessage?: string,
  inputRef?: React.RefObject<HTMLInputElement>
}

export default class EmailField extends React.Component<IProps> {
  render() {
    const {
      errorMessage,
      inputRef,
    } = this.props

    return (
      <Field>
        <Label>Email</Label>

        <Control hasIconsLeft>
          <Input
            inputRef={inputRef}
            isDanger={!!errorMessage}
            required
            type="email"
          />

          <Icon hasTextGrey isLeft>
            <Icon.Svg icon={envelope} />
          </Icon>

          {errorMessage && (
            <Help>
              <Span hasTextDanger>{errorMessage}</Span>
            </Help>
          )}
        </Control>
      </Field>
    )
  }
}
