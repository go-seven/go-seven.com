import * as React from "react"
import { FormattedMessage } from "react-intl"
import { connect } from "react-redux"
import { Redirect, RouteComponentProps } from "react-router-dom"
import {
  Button,
  Buttons,
  Column,
  Container,
  Control,
  Field,
  Input,
  Label,
  Modal,
  Notification,
  Section,
  Tag,
} from "trunx"

import HomePage from "./HomePage"
import MyUrlsPage from "./MyUrlsPage"

import Navbar from "../components/Navbar"

import {
  exitAccount,
} from "../reducers/account"
import {
  fetchUrlCollectionIfNeeded,
  removeUrlFromCollection,
  IUrl,
} from "../reducers/urlCollections"

interface IMatchParams {
  urlCollectionId: string
  urlId: string
}

interface IProps extends RouteComponentProps<IMatchParams> {
  authenticationIsValid: boolean | null
  exitAccount: () => void
  fetchUrlCollection: (urlCollectionId: string) => void
  removeUrl: (IMatchParams) => void
  url: IUrl | null | undefined
}

interface IState {
  askingRemovalConfirmation: boolean
  redirect?: string
}

class UrlPage extends React.Component<IProps, IState> {
  static path = "/url/:urlCollectionId/:urlId"

  static buildPath({ urlCollectionId, urlId }: IMatchParams) {
    return `/url/${urlCollectionId}/${urlId}`
  }

  state: IState = {
    askingRemovalConfirmation: false
  }

  askUrlRemovalConfirmation = () => {
    this.setState({
      askingRemovalConfirmation: true
    })
  }

  closeRemovalConfirmation = () => {
    this.setState({
      askingRemovalConfirmation: false,
      redirect: MyUrlsPage.path,
    })
  }

  onClickRemoveUrl = () => {
    const {
      match: { params },
      removeUrl,
    } = this.props

    this.setState({
      askingRemovalConfirmation: false,
    }, () => {
      removeUrl(params)
    })
  }

  render() {
    const {
      authenticationIsValid,
      url,
    } = this.props

    const {
      askingRemovalConfirmation,
      redirect,
    } = this.state

    if (authenticationIsValid === null) {
      return null
    }

    if (authenticationIsValid === false) {
      return (
        <Redirect push to={HomePage.path}/>
      )
    }

    if (typeof url === "undefined") {
      return (
        <Redirect push to={MyUrlsPage.path}/>
      )
    }

    if (redirect) {
      return (
        <Redirect push to={redirect} />
      )
    }

    if (askingRemovalConfirmation) {
      return (
        <Modal isActive>
          <Modal.Background onClick={this.closeRemovalConfirmation} />

          <Modal.Close
            isLarge
            onClick={this.closeRemovalConfirmation}
          />

          <Modal.Content>
            <Column>
              <Notification isDanger>
                <FormattedMessage id="UrlPage.removal-confirmation.message" />
              </Notification>

              <Buttons>
                <Button onClick={this.closeRemovalConfirmation}>
                  <FormattedMessage id="UrlPage.removal-confirmation.cancel" />
                </Button>

                <Button
                  isDanger
                  isOutlined
                  onClick={this.onClickRemoveUrl}
                >
                  <FormattedMessage id="UrlPage.removal-confirmation.action" />
                </Button>
              </Buttons>
            </Column>
          </Modal.Content>
        </Modal>
      )
    }

    return (
      <>
        <Navbar
          authenticationIsValid={authenticationIsValid}
          locationPath={this.props.location.pathname}
          exit={exitAccount}
        />

        {(url === null) ? (
          <Section>
            <Container>
              <Notification isWarning>
                Could not find URL.
              </Notification>
            </Container>
          </Section>
        ) : (
          <>
            <Section>
              <Container>
                <Field>
                  <Control>
                    <Tag isLink >{url.id}</Tag>
                  </Control>
                </Field>

                <Field>
                  <Label>
                    Title
                  </Label>

                  <Control>
                    <Input
                      readOnly
                      type="text"
                      value={url.title}
                    />
                  </Control>
                </Field>
              </Container>
            </Section>

            <Section>
              <Button
                isDanger
                isOutlined
                onClick={this.askUrlRemovalConfirmation}
              >
                Delete URL
              </Button>
            </Section>
          </>
        )}
      </>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  exitAccount: () => dispatch(exitAccount()),
  fetchUrlCollection: (urlCollectionId) => dispatch(fetchUrlCollectionIfNeeded(urlCollectionId)),
  removeUrl: ({ urlCollectionId, urlId }) => () => dispatch(removeUrlFromCollection(urlCollectionId, urlId)),
})

const mapStateToProps = (
  {
    account: {
      authentication,
    },
    urlCollections: {
      currentUrlCollection,
    }
  },
  {
    match: {
      params: {
        urlId,
      }
    }
  }
) => {
  const authenticationIsValid = authentication === null ? null : authentication.isValid

  return {
    authenticationIsValid,
    url: currentUrlCollection ? currentUrlCollection.urls.find(({ id }) => id === urlId) : null,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UrlPage)
