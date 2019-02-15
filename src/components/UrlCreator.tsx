import * as pdsp from "pdsp"
import * as React from "react"
import * as urlRegex from "regex-weburl"
import {
  Button,
  Control,
  Field,
  Hero,
  Input,
  Label,
  Section,
} from "trunx"

import {
  ICollectionsState,
  IUrl,
} from "../reducers/collections"

export interface IUrlCreatorProps {
  createUrl: (IUrl) => void
  itIsCheckingIfUrlIdExists: ICollectionsState["itIsCheckingIfUrlIdExists"]
  itIsCreatingUrl: ICollectionsState["itIsCreatingUrl"]
  setWantedUrlTimeout: number
  setWantedUrl: (IUrl) => void
  wantedUrl: IUrl | null
}

interface IState {
  canSetWantedUrlId: boolean
  wantedUrlHref: IUrl["href"]
  wantedUrlId: IUrl["href"]
}

export default class UrlCreator extends React.Component<IUrlCreatorProps, IState> {
  static defaultProps = {
    setWantedUrlTimeout: 2000
  }

  state = {
    canSetWantedUrlId: true,
    wantedUrlHref: "",
    wantedUrlId: "",
  }

  private urlHrefRef = React.createRef<HTMLInputElement>()
  private urlIdRef = React.createRef<HTMLInputElement>()

  getUrlHref(): string {
    const {
      wantedUrlHref
    } = this.state

    let urlHref = this.urlHrefRef.current && this.urlHrefRef.current.value

    if (urlHref === "" || urlHref === null) {
      return ""
    } else {
      urlHref = urlHref.trim()
    }

    if (wantedUrlHref.length < urlHref.length) { // is not deleting text
      if (urlHref.toLowerCase() === "https") {
        urlHref = "https://"
      }

      if (urlHref.toLowerCase() === "http:") {
        urlHref = "http://"
      }
    }

    return urlHref
  }

  getUrlId(): string {
    const {
      wantedUrlId
    } = this.state

    let urlId = this.urlIdRef.current && this.urlIdRef.current.value

    if (urlId === "" || urlId === null) {
      return ""
    } else {
      urlId = urlId.trim()
    }

    return urlId
  }

  onChangeUrlHref = (event) => {
    pdsp(event)

    const urlHref = this.getUrlHref()

    this.setState({ wantedUrlHref: urlHref })
  }

  onChangeUrlId = (event) => {
    pdsp(event)

    const {
      setWantedUrl,
      setWantedUrlTimeout,
    } = this.props

    const {
      canSetWantedUrlId,
    } = this.state

    const urlId = this.getUrlId()

    if (canSetWantedUrlId) {
      this.setState({
        canSetWantedUrlId: false,
        wantedUrlId: urlId,
      }, () => {
        setTimeout(() => {
          const urlId = this.getUrlId()

          this.setState({
            canSetWantedUrlId: true,
            wantedUrlId: urlId,
          }, () => {
            setWantedUrl({ id: urlId })
          })
        }, setWantedUrlTimeout)
      })
    } else {
      this.setState({ wantedUrlId: urlId })
    }
  }

  onPasteUrlHref = (event) => {
    pdsp(event)

    const {
      createUrl,
      itIsCreatingUrl,
      wantedUrl,
    } = this.props

    if (itIsCreatingUrl) {
      return null
    }

    const urlHref = event.clipboardData.getData("Text")

    const isValid = urlRegex.test(urlHref)
    const urlIsEmpty = wantedUrl === null || wantedUrl.href === ""

    // If a valid target URL is pasted in empty input text,
    // create a shortened URL on the fly. If input text is not
    // empty it does not make sense to create a shortened URL on paste
    // cause the user could need to paste few times.
    if (isValid && urlIsEmpty) {
      createUrl({ href: urlHref })
    }
  }

  render() {
    const {
      itIsCheckingIfUrlIdExists,
      itIsCreatingUrl,
      wantedUrl,
    } = this.props

    const {
      wantedUrlHref,
      wantedUrlId,
    } = this.state

    return (
      <Section>
        <Field>
          <Label>
            Your long URL
          </Label>

          <Control>
            <Input
              autoFocus
              inputRef={this.urlHrefRef}
              onChange={this.onChangeUrlHref}
              onPaste={this.onPasteUrlHref}
              placeholder="Paste or write your URL here"
              readOnly={itIsCreatingUrl}
              type="text"
              value={wantedUrlHref}
            />
          </Control>
        </Field>

        <Field>
          <Label>
            Short URL
          </Label>

          <Control
            isLoading={itIsCheckingIfUrlIdExists}
          >
            <Input
              inputRef={this.urlIdRef}
              onChange={this.onChangeUrlId}
              readOnly={itIsCreatingUrl}
              type="text"
              value={wantedUrlId}
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
      </Section>
    )
  }

  saveUrl = () => {
    const {
      createUrl,
      wantedUrl,
    } = this.props

    // Since the Save button is enabled only if url isValid
    // there is no No need to check for URL validity here.
    createUrl(wantedUrl)
  }
}
