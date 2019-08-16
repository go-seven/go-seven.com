import * as React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import {
  Button,
  Buttons,
  Column,
  Container,
  Modal,
  Notification,
  Section,
  Title
} from 'trunx'

import HomePage from './HomePage'
import MyUrlsPage from './MyUrlsPage'

import Navbar from '../components/Navbar'
import UrlEditor, { IUrlEditorProps } from '../components/UrlEditor'

import {
  exitAccount
} from '../reducers/account'
import {
  fetchUrlMetadataIfNeeded,
  removeUrlFromCollection,
  setWantedUrl,
  updateUrl,
  IUrl
} from '../reducers/urlCollections'

interface IMatchParams {
  urlCollectionId: string
  urlId: string
}

interface IProps extends RouteComponentProps<IMatchParams> {
  authenticationIsValid: boolean | null
  currentUrl: IUrl | null
  exitAccount: () => void
  fetchingUrlMetadata: boolean
  fetchUrlMetadata: (IUrl) => void
  removeUrl: (IMatchParams) => void
  removingUrl: boolean
  setWantedUrl: (IUrl) => void
  updateUrl: (urlCollectionId: string) => IUrlEditorProps['updateUrl']
  updatingUrl: boolean
  url: IUrl | undefined
  wantedUrlHrefIsValid: boolean
}

interface IState {
  askingRemovalConfirmation: boolean
  redirect?: string
}

class UrlPage extends React.Component<IProps, IState> {
  static path = '/url/:urlCollectionId/:urlId'

  static buildPath ({ urlCollectionId, urlId }: IMatchParams) {
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
      askingRemovalConfirmation: false
    })
  }

  onClickRemoveUrl = () => {
    const {
      match: { params },
      removeUrl
    } = this.props

    this.setState({
      askingRemovalConfirmation: false
    }, () => {
      removeUrl(params)
    })
  }

  render () {
    const {
      authenticationIsValid,
      currentUrl,
      fetchingUrlMetadata,
      fetchUrlMetadata,
      match: { params: { urlCollectionId } },
      removingUrl,
      updateUrl,
      updatingUrl,
      url,
      wantedUrlHrefIsValid
    } = this.props

    const {
      askingRemovalConfirmation,
      redirect
    } = this.state

    if (authenticationIsValid === null) {
      return null
    }

    if (authenticationIsValid === false) {
      return (
        <Redirect push to={HomePage.path}/>
      )
    }

    if (typeof url === 'undefined') {
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

        <Section>
          <Container>
            <Title>
              <FormattedMessage id="UrlPage.title" />
            </Title>

            <UrlEditor
              currentUrl={currentUrl}
              fetchingUrlMetadata={fetchingUrlMetadata}
              fetchUrlMetadata={fetchUrlMetadata}
              setWantedUrl={setWantedUrl}
              updateUrl={updateUrl(urlCollectionId)}
              updatingUrl={updatingUrl}
              url={url}
              wantedUrlHrefIsValid={wantedUrlHrefIsValid}
            />
          </Container>
        </Section>

        <Section>
          <Container>
            <Button
              isDanger
              isLoading={removingUrl}
              isOutlined={!removingUrl}
              onClick={this.askUrlRemovalConfirmation}
            >
              <FormattedMessage id="UrlPage.remove-url.button" />
            </Button>
          </Container>
        </Section>
      </>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  exitAccount: () => dispatch(exitAccount()),
  fetchUrlMetadata: (url) => dispatch(fetchUrlMetadataIfNeeded(url)),
  removeUrl: ({ urlCollectionId, urlId }) => dispatch(removeUrlFromCollection(urlCollectionId, urlId)),
  setWantedUrl: (url) => dispatch(setWantedUrl(url)),
  updateUrl: (urlCollectionId) => (url) => dispatch(updateUrl(urlCollectionId, url))
})

const mapStateToProps = (
  {
    account: {
      authentication
    },
    urlCollections: {
      currentUrlCollection,
      currentUrl,
      fetchingUrlMetadata,
      justCreatedUrls,
      removingUrlId,
      updatingUrl,
      wantedUrlHrefIsValid
    }
  },
  {
    match: {
      params: {
        urlId
      }
    }
  }
) => ({
  authenticationIsValid: authentication === null ? null : authentication.isValid,
  currentUrl,
  fetchingUrlMetadata,
  justCreatedUrls,
  removingUrl: removingUrlId === urlId,
  updatingUrl,
  url: currentUrlCollection ? currentUrlCollection.urls.find(({ id }) => id === urlId) : undefined,
  wantedUrlHrefIsValid
})

export default connect(mapStateToProps, mapDispatchToProps)(UrlPage)
