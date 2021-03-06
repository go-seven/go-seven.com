import pdsp from 'pdsp'
import * as React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Control,
  Field,
  Label,
  Help,
  Input
} from 'trunx'

interface IShortUrlIdFieldProps {
  domain: string
  label: string
  isLoading: boolean
  readOnly: boolean
  resetUrlId: number
  setWantedUrlId: (id: string) => void
  wantedUrlId: string
  wantedUrlIdExists: boolean
}

export default function ShortUrlIdField ({
  domain,
  isLoading,
  label,
  readOnly,
  resetUrlId,
  setWantedUrlId,
  wantedUrlId,
  wantedUrlIdExists
}: IShortUrlIdFieldProps) {
  const delay = 2000
  const urlPrefix = `https://${domain}/`

  const wantedUrlRef = React.useRef(null)

  const [componentDidMount, setComponentDidMount] = React.useState(false)
  const [debouncedUrlId, setDebouncedUrlId] = React.useState(wantedUrlId)

  const getUrlId = (value) => {
    if (value === null) {
      return ''
    }

    if (value.length <= urlPrefix.length) {
      return ''
    }

    // TODO filter non URL characters
    // TODO allow emojis
    //
    // https://www.regextester.com/106421
    //
    // (\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])
    return value.trim().replace(urlPrefix, '')
  }

  React.useEffect(() => {
    setComponentDidMount(true)
  }, [])

  React.useEffect(() => {
    if (componentDidMount) {
      setWantedUrlId('')
    }
  }, [resetUrlId])

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedUrlId(wantedUrlId)
    }, delay)

    return () => { clearTimeout(handler) }
  }, [wantedUrlId])

  React.useEffect(() => {
    setWantedUrlId(debouncedUrlId)
  }, [debouncedUrlId])

  const onChange = (event) => {
    pdsp(event)

    const wantedUrlId = getUrlId(event.target.value)

    setWantedUrlId(wantedUrlId)
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
          inputRef={wantedUrlRef}
          isDanger={wantedUrlId !== '' && wantedUrlIdExists}
          isSuccess={wantedUrlId !== '' && !wantedUrlIdExists}
          onChange={onChange}
          placeholder={urlPrefix}
          readOnly={readOnly}
          type="text"
          value={`${urlPrefix}${wantedUrlId}`}
        />
      </Control>

      <Help isDanger={wantedUrlIdExists}>
        {wantedUrlIdExists && (
          <FormattedMessage id="ShortUrlHrefField.help.not-available" />
        )}
      </Help>
    </Field>
  )
}
