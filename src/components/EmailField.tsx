import * as envelope from 'fa-svg-icon/solid/envelope'
import * as React from 'react'
import {
  Control,
  Field,
  Help,
  Icon,
  Input,
  Label,
  Span
} from 'trunx'

export default function EmailField ({
  errorMessage = '',
  inputRef
}) {
  return (
    <Field>
      <Label>Email</Label>

      <Control hasIconsLeft>
        <Input
          inputRef={inputRef}
          isDanger={Boolean(errorMessage)}
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
