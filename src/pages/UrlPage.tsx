import no from 'not-defined'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { bindActionCreators } from 'redux'
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

import Navbar from '../components/Navbar'
import UrlEditor from '../components/UrlEditor'

import {
  exitAccount
} from '../reducers/account'
import {
  fetchUrlMetadataIfNeeded,
  removeUrlFromCollection,
  setWantedUrl,
  updateUrl,
} from '../reducers/urlCollections'

import pagePath from './paths'

function UrlPage ({
  authenticationIsValid,
  currentUrl,
  fetchingUrlMetadata,
  fetchUrlMetadata,
  match: { params: { urlCollectionId, urlId } },
  removingUrl,
  updateUrl,
  updatingUrl,
  url,
  wantedUrlHrefIsValid
}) {
  const [redirect, setRedirect] = useState('')

  const [askingRemovalConfirmation, setAskingRemovalConfirmation] = useState(false)

  useEffect(() => {
    if (authenticationIsValid === false) {
      setRedirect(pagePath.home())
    }
  }, [authenticationIsValid, setRedirect])

  useEffect(() => {
    if (no(url)) {
      setRedirect(pagePath.myUrls())
    }
  }, [setRedirect, url])

  if (redirect) {
    return (
      <Redirect push to={redirect} />
    )
  }

  if (authenticationIsValid === null) {
    return null
  }

  if (redirect) {
    return (
      <Redirect push to={redirect}/>
    )
  }

  if (askingRemovalConfirmation) {
    return (
      <Modal isActive>
        <Modal.Background onClick={() => setAskingRemovalConfirmation(false)} />

        <Modal.Close
          isLarge
          onClick={() => setAskingRemovalConfirmation(false)}
        />

        <Modal.Content>
          <Column>
            <Notification isDanger>
              <FormattedMessage id="UrlPage.removal-confirmation.message" />
            </Notification>

            <Buttons>
              <Button onClick={() => setAskingRemovalConfirmation(false)}>
                <FormattedMessage id="UrlPage.removal-confirmation.cancel" />
              </Button>

              <Button
                isDanger
                isOutlined
                onClick={() => {
                  setAskingRemovalConfirmation(false)
                  removeUrlFromCollection({ urlCollectionId, urlId })
                }}
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
            onClick={() => setAskingRemovalConfirmation(true)}
          >
            <FormattedMessage id="UrlPage.remove-url.button" />
          </Button>
        </Container>
      </Section>
    </>
  )
}

const mapStateToProps = ({
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
}) => ({
  authenticationIsValid: authentication === null ? null : authentication.isValid,
  currentUrl,
  fetchingUrlMetadata,
  justCreatedUrls,
  removingUrl: removingUrlId === urlId,
  updatingUrl,
  url: currentUrlCollection ? currentUrlCollection.urls.find(({ id }) => id === urlId) : undefined,
  wantedUrlHrefIsValid
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  exitAccount,
  fetchUrlMetadataIfNeeded,
  removeUrlFromCollection,
  setWantedUrl,
  updateUrl,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(UrlPage)
