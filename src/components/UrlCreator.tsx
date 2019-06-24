import * as pdsp from "pdsp"
import * as React from "react"
import {
  Button,
  Checkbox,
  Column,
  Columns,
  Container,
  Control,
  Field,
  Help,
  Hero,
  Input,
  Label,
} from "trunx"

import {
  ICollectionsState,
  IUrl,
} from "../reducers/collections"

export interface IUrlCreatorProps {
  createUrl: (IUrl) => void
  domain: string
  checkingIfUrlIdExists: ICollectionsState["checkingIfUrlIdExists"]
  creatingUrl: ICollectionsState["creatingUrl"]
  fetchingUrlMetadata: ICollectionsState["fetchingUrlMetadata"]
  setWantedUrlTimeout: number
  setWantedUrl: (IUrl) => void
  wantedUrl: ICollectionsState["wantedUrl"]
  wantedUrlHrefIsValid: ICollectionsState["wantedUrlHrefIsValid"]
  wantedUrlIdExists: ICollectionsState["wantedUrlIdExists"]
}

interface IState {
  canSetWantedUrlHref: boolean
  canSetWantedUrlId: boolean
  showOptions: boolean
  wantedUrlHref: string
  wantedUrlId: string
}

export default class UrlCreator extends React.Component<IUrlCreatorProps, IState> {
  static defaultProps = {
    domain: "go7.li",
    setWantedUrlTimeout: 2000,
  }

  state = {
    canSetWantedUrlHref: true,
    canSetWantedUrlId: true,
    showOptions: false,
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
    const {
      domain
    } = this.props

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

  onChangeOptionsVisibility = (event) => {
    this.setState({
        showOptions: event.target.checked
    })
  }

  onClickSave = (event) => {
    pdsp(event)

    const {
      createUrl,
      wantedUrl,
    } = this.props

    // Since the Save button is enabled only if url isValid
    // there is no No need to check for URL validity here.
    createUrl(wantedUrl)
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
      showOptions,
      wantedUrlHref,
      wantedUrlId,
    } = this.state

    const saveButtonDisabled = wantedUrlIdExists === true || wantedUrlHrefIsValid !== true || fetchingUrlMetadata || checkingIfUrlIdExists

    return (
      <Hero isPrimary>
        <Hero.Body>
            <Container>
            <Field>
              <Label>
                Your long URL
              </Label>

              <Control
                isLoading={fetchingUrlMetadata}
              >
                <Input
                  autoFocus
                  inputRef={this.urlHrefRef}
                  isDanger={wantedUrlHref !== "" && wantedUrlHrefIsValid === false}
                  isSuccess={wantedUrlHref !== "" && wantedUrlHrefIsValid === true}
                  onChange={this.onChangeUrlHref}
                  placeholder="Paste or write your URL here"
                  readOnly={creatingUrl}
                  type="text"
                  value={wantedUrlHref}
                />
              </Control>

              <Help isDanger={wantedUrlHrefIsValid === false}>
                {wantedUrlHrefIsValid === false && "Invalid URL"}
              </Help>
            </Field>

            {showOptions && (
              <>
                <Field>
                  <Label>
                    Title
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
                        Short URL
                      </Label>

                      <Control
                        isLoading={checkingIfUrlIdExists}
                      >
                        <Input
                          inputRef={this.urlIdRef}
                          isDanger={wantedUrlId !== "" && wantedUrlIdExists === true}
                          isSuccess={wantedUrlId !== "" && wantedUrlIdExists === false}
                          onChange={this.onChangeUrlId}
                          placeholder="go7.li/"
                          readOnly={creatingUrl}
                          type="text"
                          value={`go7.li/${wantedUrlId}`}
                        />
                      </Control>

                      <Help isDanger={wantedUrlIdExists === true}>
                        {wantedUrlIdExists === true && "Not available"}
                      </Help>
                    </Field>
                  </Column>
                </Columns>
              </>
            )}

            <Field>
              <Checkbox
                checked={showOptions}
                onClick={this.onChangeOptionsVisibility}
              >
                {showOptions ? "Hide Options" : "Show Options"}
              </Checkbox>
            </Field>

            <Field>
              <Control>
                <Button
                  disabled={saveButtonDisabled}
                  isLoading={creatingUrl}
                  isSuccess={wantedUrlHrefIsValid === true}
                  onClick={this.onClickSave}
                >
                  Save
                </Button>
              </Control>
            </Field>
          </Container>
        </Hero.Body>
      </Hero>
    )
  }
}
