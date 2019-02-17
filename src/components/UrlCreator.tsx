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
  domain: string
  itIsCheckingIfUrlIdExists: ICollectionsState["itIsCheckingIfUrlIdExists"]
  itIsCreatingUrl: ICollectionsState["itIsCreatingUrl"]
  setWantedUrlTimeout: number
  setWantedUrl: (IUrl) => void
  wantedUrl: ICollectionsState["wantedUrl"]
  wantedUrlIdExists: ICollectionsState["wantedUrlIdExists"]
}

interface IState {
  canSetWantedUrlId: boolean
  wantedUrlHref: string
  wantedUrlHrefIsValid: boolean | null
  wantedUrlId: string
}

export default class UrlCreator extends React.Component<IUrlCreatorProps, IState> {
  static defaultProps = {
    domain: "go7.li",
    setWantedUrlTimeout: 2000,
  }

  state = {
    canSetWantedUrlId: true,
    wantedUrlHref: "",
    wantedUrlHrefIsValid: null,
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

    if (wantedUrlHref.length < urlHref.length) { // user is not deleting text
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
      domain
    } = this.props

    const {
      wantedUrlId
    } = this.state

    const prefix = `${domain}/`

    let urlId = this.urlIdRef.current && this.urlIdRef.current.value

    if (urlId === null) {
      return ""
    }

    if (urlId.length <= prefix.length) {
      return ""
    }

    urlId = urlId.trim()
    urlId = urlId.replace(prefix, "")

    return urlId
  }

  onChangeUrlHref = (event) => {
    pdsp(event)

    const wantedUrlHref = this.getUrlHref()
    const wantedUrlHrefIsValid = urlRegex.test(wantedUrlHref)

    this.setState({
      wantedUrlHref,
      wantedUrlHrefIsValid,
    })
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

  render() {
    const {
      itIsCheckingIfUrlIdExists,
      itIsCreatingUrl,
      wantedUrl,
      wantedUrlIdExists,
    } = this.props

    const {
      wantedUrlHref,
      wantedUrlHrefIsValid,
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
              isDanger={wantedUrlHref !== "" && wantedUrlHrefIsValid === false}
              isSuccess={wantedUrlHref !== "" && wantedUrlHrefIsValid === true}
              onChange={this.onChangeUrlHref}
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
              isDanger={wantedUrlId !== "" && wantedUrlIdExists === true}
              isSuccess={wantedUrlId !== "" && wantedUrlIdExists === false}
              onChange={this.onChangeUrlId}
              placeholder="go7.li/"
              readOnly={itIsCreatingUrl}
              type="text"
              value={`go7.li/${wantedUrlId}`}
            />
          </Control>
        </Field>
        <Field>
          <Control>
            <Button
              disabled={wantedUrlIdExists || wantedUrlHref === "" || !wantedUrlHrefIsValid
              }
              isLoading={itIsCreatingUrl}
              isSuccess={wantedUrlHrefIsValid === true}
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
