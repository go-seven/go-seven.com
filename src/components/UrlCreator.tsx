import * as pdsp from "pdsp"
import * as React from "react"
import { FormattedMessage } from "react-intl"
import InjectIntl from "react-intl-inject"
import {
  Box,
  Button,
  Column,
  Columns,
  Control,
  Field,
  Help,
  Input,
  Label,
} from "trunx"

import {
  IUrl,
} from "../reducers/urlCollections"

export interface IUrlCreatorProps {
  createUrl: (IUrl) => void
  domain: string
  checkingIfUrlIdExists: boolean
  creatingUrl: boolean
  fetchingUrlMetadata: boolean
  setWantedUrlTimeout: number
  setWantedUrl: (IUrl) => void
  wantedUrl: IUrl | null
  wantedUrlHrefIsValid: boolean
  wantedUrlIdExists: boolean
}

interface IState {
  canSetWantedUrlHref: boolean
  canSetWantedUrlId: boolean
  wantedUrlHref: string
  wantedUrlId: string
}

const generateId = () => (
  new Date().getTime().toString(36)
)

export default class UrlCreator extends React.Component<IUrlCreatorProps, IState> {
  static defaultProps = {
    domain: "go7.li",
    setWantedUrlTimeout: 2000,
  }

  state = {
    canSetWantedUrlHref: true,
    canSetWantedUrlId: true,
    wantedUrlHref: "",
    wantedUrlId: "",
  }

  private urlHrefRef = React.createRef<HTMLInputElement>()
  private urlIdRef = React.createRef<HTMLInputElement>()

  componentDidMount() {
    const {
      setWantedUrl
    } = this.props

    const wantedUrlId = generateId()

    this.setState({
      canSetWantedUrlId: true,
      wantedUrlId,
    }, () => {
      setWantedUrl({ id: wantedUrlId })
    })
  }

  getShortUrlPrefix(): string {
    const {
      domain,
    } = this.props

    return `https://${domain}/`
  }

  getUrlHref(): string {
    const {
      wantedUrlHref
    } = this.state

    let urlHref = this.urlHrefRef.current!.value

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

  getUrlId(): string {
    const shortUrlPrefix = this.getShortUrlPrefix()

    const inputValue = this.urlIdRef.current!.value

    if (inputValue === null) {
      return ""
    }

    if (inputValue.length <= shortUrlPrefix.length) {
      return ""
    }


    return inputValue.trim().replace(shortUrlPrefix, "")
  }

  onChangeUrlHref = (event) => {
    pdsp(event)

    const {
      setWantedUrl,
      setWantedUrlTimeout,
    } = this.props

    const {
      canSetWantedUrlHref,
    } = this.state

    const wantedUrlHref = this.getUrlHref()

    this.setState({
      wantedUrlHref,
    })
    if (canSetWantedUrlHref) {
      this.setState({
        canSetWantedUrlHref: false,
        wantedUrlHref,
      }, () => {
        setTimeout(() => {
          const wantedUrlHref = this.getUrlHref()

          this.setState({
            canSetWantedUrlHref: true,
            wantedUrlHref,
          }, () => {
            setWantedUrl({ href: wantedUrlHref })
          })
        }, setWantedUrlTimeout)
      })
    } else {
      this.setState({
        wantedUrlHref,
      })
    }
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

    const wantedUrlId = this.getUrlId()

    if (canSetWantedUrlId) {
      this.setState({
        canSetWantedUrlId: false,
        wantedUrlId,
      }, () => {
        setTimeout(() => {
          const wantedUrlId = this.getUrlId()

          this.setState({
            canSetWantedUrlId: true,
            wantedUrlId,
          }, () => {
            setWantedUrl({ id: wantedUrlId })
          })
        }, setWantedUrlTimeout)
      })
    } else {
      this.setState({ wantedUrlId })
    }
  }

  onSubmit = (event) => {
    pdsp(event)

    const {
      createUrl,
      wantedUrl,
    } = this.props

    const {
      wantedUrlId,
    } = this.state

    if (wantedUrl !== null) {
      const { href, title } = wantedUrl

      createUrl({ href, id: wantedUrlId, title })
    }
  }

  render() {
    const {
      checkingIfUrlIdExists,
      creatingUrl,
      fetchingUrlMetadata,
      wantedUrl,
      wantedUrlIdExists,
      wantedUrlHrefIsValid,
    } = this.props

    const {
      wantedUrlHref,
      wantedUrlId,
    } = this.state

    const saveButtonDisabled = (
      (wantedUrlIdExists === true) ||
      (wantedUrlHrefIsValid !== true) ||
      fetchingUrlMetadata ||
      checkingIfUrlIdExists
    )

    const shortUrlPrefix = this.getShortUrlPrefix()

    return (
      <form
        onSubmit={this.onSubmit}
      >
        <Box>
          <Field>
            <Label>
              <FormattedMessage id="UrlCreator.target-url.label" />
            </Label>

            <Control
              isLoading={fetchingUrlMetadata}
            >
              <InjectIntl>
                {({ intl }) => (
                  <Input
                    inputRef={this.urlHrefRef}
                    isDanger={wantedUrlHref !== "" && wantedUrlHrefIsValid === false}
                    isSuccess={wantedUrlHref !== "" && wantedUrlHrefIsValid === true}
                    onChange={this.onChangeUrlHref}
                    placeholder={intl.formatMessage({ id: "UrlCreator.target-url.placeholder" })}
                    readOnly={creatingUrl}
                    type="text"
                    value={wantedUrlHref}
                  />
                )}
              </InjectIntl>
            </Control>

            <Help isDanger={wantedUrlHrefIsValid === false}>
              {wantedUrlHrefIsValid === false && "Invalid URL"}
            </Help>
          </Field>

          <Field>
            <Label>
              <FormattedMessage id="UrlCreator.short-url-title.label" />
            </Label>

            <Control
              isLoading={fetchingUrlMetadata}
            >
              <Input
                readOnly
                type="text"
                value={wantedUrl && wantedUrl.title || ""}
              />
            </Control>
          </Field>

          <Columns isDesktop>
            <Column isHalf>
              <Field>
                <Label>
                  <FormattedMessage id="UrlCreator.short-url-title.label" />
                </Label>

                <Control
                  isLoading={checkingIfUrlIdExists}
                >
                  <Input
                    inputRef={this.urlIdRef}
                    isDanger={wantedUrlId !== "" && wantedUrlIdExists === true}
                    isSuccess={wantedUrlId !== "" && wantedUrlIdExists === false}
                    onChange={this.onChangeUrlId}
                    placeholder={shortUrlPrefix}
                    readOnly={creatingUrl}
                    type="text"
                    value={`${shortUrlPrefix}${wantedUrlId}`}
                  />
                </Control>

                <Help isDanger={wantedUrlIdExists === true}>
                  {wantedUrlIdExists === true && "Not available"}
                </Help>
              </Field>
            </Column>
          </Columns>

          <Field>
            <Control>
              <InjectIntl>
                {({ intl }) => (
                  <Button
                    disabled={saveButtonDisabled}
                    isLoading={creatingUrl}
                    isSuccess={wantedUrlHrefIsValid === true}
                    type="submit"
                    value={intl.formatMessage({ id: "UrlCreator.submit" })}
                  />
                )}
              </InjectIntl>
            </Control>
          </Field>
        </Box>
      </form>
    )
  }
}
