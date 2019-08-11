import * as pdsp from "pdsp"
import * as React from "react"
import { useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"
import {
  Control,
  Field,
  Help,
  Input,
  Label,
} from "trunx"

import {
  IUrl,
} from "../reducers/urlCollections"

export interface ITargetUrlFieldProps {
  initialUrlHref?: string
  isLoading: boolean
  label: string
  placeholder?: string
  resetTargetUrlHref: number,
  setTargetUrl: (IUrl) => void
  readOnly: boolean
  wantedUrlHrefIsValid: boolean
}

export default function TargetUrlField({
  initialUrlHref,
  isLoading,
  label,
  placeholder,
  readOnly,
  resetTargetUrlHref,
  setTargetUrl,
  wantedUrlHrefIsValid,
}: ITargetUrlFieldProps) {
  const delay = 2000

  const [wantedUrlHref, setWantedUrlHref] = useState(initialUrlHref || "")
  const [debouncedUrlHref, setDebouncedUrlHref] = useState(wantedUrlHref)

  const [componentDidMount, setComponentDidMount] = useState(false)

  const getUrlHref = (urlHref) => {
    if (urlHref === "" || urlHref === null) {
      return ""
    } else {
      urlHref = urlHref.trim()
    }

    if (wantedUrlHref.length < urlHref.length) { // user is not deleting text
      if (urlHref.toLowerCase() === "http:") {
        urlHref = "http://"
      }

      if (urlHref.toLowerCase() === "https") {
        urlHref = "https://"
      }

      if (urlHref.toLowerCase() === "http:///") {
        urlHref = "http://"
      }

      if (urlHref.toLowerCase() === "https:///") {
        urlHref = "https://"
      }
    }

    return urlHref
  }

  useEffect(() => {
    setComponentDidMount(true)
  }, [])

  useEffect(() => {
    if (componentDidMount) {
      setWantedUrlHref("")
    }
  }, [resetTargetUrlHref])

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedUrlHref(wantedUrlHref)
    }, delay)

    return () => { clearTimeout(handler) }
  }, [wantedUrlHref])

  useEffect(() => {
    setTargetUrl({ href: debouncedUrlHref })
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
          isDanger={wantedUrlHref !== "" && wantedUrlHrefIsValid === false}
          isSuccess={wantedUrlHref !== "" && wantedUrlHrefIsValid === true}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          type="text"
          value={wantedUrlHref}
        />
      </Control>

      <Help
        isDanger={wantedUrlHrefIsValid === false}
      >
        {wantedUrlHrefIsValid === false && (
          <FormattedMessage id="TargetUrlField.help.invalid-url" />
        )}
      </Help>
    </Field>
  )
}
