import * as React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import {
  Box,
  Container,
  Section,
  Title
} from 'trunx'

import HomePage from './HomePage'

import Navbar from '../components/Navbar'
import UrlCreator, { IUrlCreatorProps } from '../components/UrlCreator'

import {
  exitAccount
} from '../reducers/account'
import {
  createUrl,
  setWantedUrl,
  IUrl
} from '../reducers/urlCollections'

interface IProps extends RouteComponentProps {
  authenticationIsValid: boolean
  checkingIfUrlIdExists: boolean
  creatingUrl: boolean
  createUrl: IUrlCreatorProps['createUrl']
  domain: string
  exitAccount: () => void
  justCreatedUrls: IUrl[]
  fetchingUrlMetadata: boolean
  setWantedUrl: (IUrl) => void
  wantedUrl: IUrl | null
  wantedUrlHrefIsValid: boolean
  wantedUrlIdExists: boolean
}

class MyUrlsPage extends React.Component<IProps> {
  static path = '/create-url'

  render () {
    const {
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
    } = this.props

    if (authenticationIsValid === false) {
      return (
        <Redirect push to={HomePage.path}/>
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

const mapDispatchToProps = (dispatch) => ({
  createUrl: (url) => dispatch(createUrl(url)),
  exitAccount: () => dispatch(exitAccount()),
  setWantedUrl: (url) => dispatch(setWantedUrl(url))
})

export default connect(mapStateToProps, mapDispatchToProps)(MyUrlsPage)
