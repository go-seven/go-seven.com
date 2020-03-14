import pdsp from 'pdsp'
import * as React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Control,
  Field,
  Help,
  Input,
  Label
} from 'trunx'

export interface ITargetUrlFieldProps {
  initialUrlHref?: string
  isLoading: boolean
  label: string
  placeholder?: string
  resetTargetUrlHref: number
  setTargetUrlHref: (href: string) => void
  readOnly: boolean
  wantedUrlHrefIsValid: boolean
}

export default function TargetUrlField ({
  initialUrlHref,
  isLoading,
  label,
  placeholder,
  readOnly,
  resetTargetUrlHref,
  setTargetUrlHref,
  wantedUrlHrefIsValid
}: ITargetUrlFieldProps) {
  const delay = 2000

  const [wantedUrlHref, setWantedUrlHref] = React.useState(initialUrlHref ?? '')
  const [debouncedUrlHref, setDebouncedUrlHref] = React.useState(wantedUrlHref)

  const [componentDidMount, setComponentDidMount] = React.useState(false)

  const getUrlHref = (value) => {
    if (value === '' || value === null) {
      return ''
    } else {
      value = value.trim()
    }

    if (wantedUrlHref.length < value.length) { // user is not deleting text
      if (value.toLowerCase() === 'http:') {
        value = 'http://'
      }

      if (value.toLowerCase() === 'https') {
        value = 'https://'
      }

      if (value.toLowerCase() === 'http:///') {
        value = 'http://'
      }

      if (value.toLowerCase() === 'https:///') {
        value = 'https://'
      }
    }

    return value
  }

  React.useEffect(() => {
    setComponentDidMount(true)
  }, [])

  React.useEffect(() => {
    if (componentDidMount) {
      setWantedUrlHref('')
    }
  }, [resetTargetUrlHref])

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedUrlHref(wantedUrlHref)
    }, delay)

    return () => { clearTimeout(handler) }
  }, [wantedUrlHref])

  React.useEffect(() => {
    setTargetUrlHref(debouncedUrlHref)
  }, [debouncedUrlHref])

  const onChange = (event) => {
    pdsp(event)

    const wantedUrlHref = getUrlHref(event.target.value)

    setWantedUrlHref(wantedUrlHref)
  }

  return (
    <Field>
      <Label>
        {label}
      </Label>

      <Control
        isLoading={isLoading}
      >
        <Input
          isDanger={wantedUrlHref !== '' && !wantedUrlHrefIsValid}
          isSuccess={wantedUrlHref !== '' && wantedUrlHrefIsValid}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          type="text"
          value={wantedUrlHref}
        />
      </Control>

      <Help
        isDanger={!wantedUrlHrefIsValid}
      >
        {!wantedUrlHrefIsValid && (
          <FormattedMessage id="TargetUrlHrefField.help.invalid-url" />
        )}
      </Help>
    </Field>
  )
}
