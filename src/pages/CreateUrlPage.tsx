import * as React from 'react'
import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import {
  Box,
  Container,
  Section,
  Title
} from 'trunx'

import Navbar from '../components/Navbar'
import UrlCreator from '../components/UrlCreator'

import {
  exitAccount
} from '../reducers/account'
import {
  createUrl,
  setWantedUrl,
} from '../reducers/urlCollections'

import pagePath from './paths'

function MyUrlsPage ({
  authenticationIsValid,
  checkingIfUrlIdExists,
  createUrl,
  creatingUrl,
  domain,
  fetchingUrlMetadata,
  justCreatedUrls,
  setWantedUrl,
  wantedUrl,
  wantedUrlHrefIsValid,
  wantedUrlIdExists
}) {
  const [redirect, setRedirect] = useState('')

  useEffect(() => {
    if (!authenticationIsValid) {
      setRedirect(pagePath.home())
    }
  }, [authenticationIsValid, setRedirect])

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
            <FormattedMessage id="CreateUrlPage.title" />
          </Title>

          <UrlCreator
            createUrl={createUrl}
            checkingIfUrlIdExists={checkingIfUrlIdExists}
            creatingUrl={creatingUrl}
            domain={domain}
            fetchingUrlMetadata={fetchingUrlMetadata}
            justCreatedUrls={justCreatedUrls}
            setWantedUrl={setWantedUrl}
            wantedUrl={wantedUrl}
            wantedUrlIdExists={wantedUrlIdExists}
            wantedUrlHrefIsValid={wantedUrlHrefIsValid}
          />
        </Container>
      </Section>

      <Section>
        {/* TODO show URL preview */}
        {justCreatedUrls.map((url, i) => (
          <Box key={i}>
            <div>{url.href}</div>
          </Box>
        ))}
      </Section>
    </>
  )
}

const mapStateToProps = ({
  account: {
    authentication,
    domain
  },
  urlCollections: {
    checkingIfUrlIdExists,
    creatingUrl,
    fetchingUrlMetadata,
    justCreatedUrls,
    wantedUrl,
    wantedUrlHrefIsValid,
    wantedUrlIdExists
  }
}) => ({
  authenticationIsValid: authentication === null ? false : authentication.isValid,
  checkingIfUrlIdExists,
  creatingUrl,
  domain,
  fetchingUrlMetadata,
  justCreatedUrls,
  wantedUrl,
  wantedUrlHrefIsValid,
  wantedUrlIdExists
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  createUrl,
  exitAccount,
  setWantedUrl,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MyUrlsPage)
