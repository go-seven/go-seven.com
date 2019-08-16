import * as React from 'react'
import {
  Control,
  Field,
  Label
} from 'trunx'

interface IReadOnlyTextFieldProps {
  label: string
  text: string
}

export default function ReadOnlyTextField ({
  label,
  text
}: IReadOnlyTextFieldProps) {
  return (
    <Field>
      <Label>
        {label}
      </Label>

      <Control>
        <div className="readonly-text-field">
          {text}
        </div>
      </Control>
    </Field>
  )
}
