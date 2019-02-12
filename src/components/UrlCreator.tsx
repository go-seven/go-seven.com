import pdsp from "pdsp"
import * as React from "react"
import urlRegex from "regex-weburl"
import {
  Button,
  Control,
  Field,
  Hero,
  Input,
  Label,
} from "trunx"

import {
  IUrl,
} from "../reducers/collections"

export interface IUrlCreatorProps {
  createUrl: (IUrl) => void
  itIsCreating: boolean
  setUrl: (IUrl) => void
  url: IUrl | null
}

export default class UrlCreator extends React.Component<IUrlCreatorProps> {
  onChangeUrl = (event) => {
    pdsp(event)

    const {
      itIsCreating,
      setUrl,
    } = this.props

    if (itIsCreating) {
      return
    }

    setUrl(event.target.value)
  }

  onPasteUrl = (event) => {
    pdsp(event)

    const {
      createUrl,
      itIsCreating,
      url,
    } = this.props

    if (itIsCreating) {
      return null
    }

    const href = event.clipboardData.getData("Text")

    const isValid = urlRegex.test(href)
    const urlIsEmpty = url === null || url.href === ""

    // If a valid target URL is pasted in empty input text,
    // create a shortened URL on the fly. If input text is not
    // empty it does not make sense to create a shortened URL on paste
    // cause the user could need to paste few times.
    if (isValid && urlIsEmpty) {
      createUrl({ href })
    }
  }

  render() {
    const {
      itIsCreating,
      url,
    } = this.props

    return (
      <Hero isPrimary>
        <Hero.Body>
          <Field>
            <Label>
              Your URL
            </Label>

            <Control>
              <Input
                onChange={this.onChangeUrl}
                onPaste={this.onPasteUrl}
                placeholder="Paste or write your URL here"
                readOnly={itIsCreating}
                type="text"
                value={url && url.href || ""}
              />
            </Control>
          </Field>

          <Field>
            <Control>
              <Button
                disabled
              >
                Save
              </Button>
            </Control>
          </Field>
        </Hero.Body>
      </Hero>
    )
  }

  saveUrl = () => {
    const {
      createUrl,
      url,
    } = this.props

    // Since the Save button is enabled only if url isValid
    // there is no No need to check for URL validity here.
    createUrl(url)
  }
}
