import * as React from 'react'
import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import {
  Container,
  Progress,
  Section,
  Title
} from 'trunx'

import Navbar from '../components/Navbar'
import UrlCollection from '../components/UrlCollection'

import pagePath from './paths'

import {
  exitAccount
} from '../reducers/account'
import {
  fetchUrlDailyHitsIfNeeded,
  fetchUrlMonthlyHitsIfNeeded,
} from '../reducers/analytics'
import {
  fetchUrlCollectionIfNeeded,
  // removeUrlFromCollection,
} from '../reducers/urlCollections'

function MyUrlsPage ({
  authenticationIsValid,
  exitAccount,
  fetchUrlCollection,
  fetchUrlDailyHits,
  fetchUrlMonthlyHits,
  isFetchingUrlCollection,
  // removeUrlFromCollection,
  removingUrlId,
  // selectedUrlCollectionId,
  urlCollection,
  urlsDailyHits,
  urlsMonthlyHits
}) {
  const [redirect, setRedirect] = useState('')

  useEffect(() => {
    if (authenticationIsValid === false) {
      setRedirect(pagePath.home())
    }
  }, [authenticationIsValid, setRedirect])

  if (authenticationIsValid === null) {
    return null
  }

  if (redirect) {
    return (
      <Redirect push to={redirect}/>
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
            <FormattedMessage id="MyUrlsPage.title" />
          </Title>

          {isFetchingUrlCollection && (
            <Progress isPrimary />
          )}

          {urlCollection && (
            <UrlCollection
              fetchUrlCollection={fetchUrlCollection}
              fetchUrlDailyHits={fetchUrlDailyHits}
              fetchUrlMonthlyHits={fetchUrlMonthlyHits}
              key={urlCollection.id}
              removingUrlId={removingUrlId}
              urlCollection={urlCollection}
              urlsDailyHits={urlsDailyHits}
              urlsMonthlyHits={urlsMonthlyHits}
            />
          )}
        </Container>
      </Section>
    </>
  )
}

const mapStateToProps = ({
  account: {
    authentication
  },
  analytics: {
    urlsDailyHits,
    urlsMonthlyHits
  },
  urlCollections: {
    creatingUrl,
    currentUrlCollection,
    fetchingUrlMetadata,
    isFetchingUrlCollection,
    removingUrlId,
    // selectedUrlCollectionId,
    wantedUrl,
    wantedUrlHrefIsValid,
    wantedUrlIdExists
  }
}) => ({
  authenticationIsValid: authentication === null ? null : authentication.isValid,
  creatingUrl,
  fetchingUrlMetadata,
  isFetchingUrlCollection,
  removingUrlId,
  // selectedUrlCollectionId,
  urlCollection: currentUrlCollection,
  urlsDailyHits,
  urlsMonthlyHits,
  wantedUrl,
  wantedUrlHrefIsValid,
  wantedUrlIdExists
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  exitAccount,
  fetchUrlCollectionIfNeeded,
  fetchUrlDailyHitsIfNeeded,
  fetchUrlMonthlyHitsIfNeeded,
  // removeUrlFromCollection,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MyUrlsPage)
