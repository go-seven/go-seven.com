import * as React from "react"
import { FormattedMessage } from "react-intl"
import { connect } from "react-redux"
import { Redirect, RouteComponentProps } from "react-router-dom"
import {
  Container,
  Progress,
  Section,
  Title,
} from "trunx"

import HomePage from "./HomePage"

import Navbar from "../components/Navbar"
import UrlCollection, { IUrlCollectionProps } from "../components/UrlCollection"

import {
  exitAccount,
} from "../reducers/account"
import {
  fetchUrlDailyHitsIfNeeded,
  fetchUrlTotalHitsIfNeeded,
  IUrlDailyHits,
  IUrlTotalHits,
} from "../reducers/analytics"
import {
  fetchUrlCollectionIfNeeded,
  removeUrlFromCollection,
  IUrlCollection,
} from "../reducers/urlCollections"

interface IProps extends RouteComponentProps {
  authenticationIsValid: boolean | null
  exitAccount: () => void
  fetchUrlCollection: IUrlCollectionProps["fetchUrlCollection"]
  fetchUrlDailyHits: (urlId: string, day: string) => void
  fetchUrlTotalHits: (urlId: string) => void
  fetchingUrlMetadata: boolean
  isFetchingUrlCollection: boolean
  removeUrlFromCollection: (urlCollectionId: string) => (urlId: string) => () => void,
  removingUrlId: string
  selectedUrlCollectionId: string
  urlCollection: IUrlCollection | null
  urlsDailyHits: IUrlDailyHits[]
  urlsTotalHits: IUrlTotalHits[]
}

class MyUrlsPage extends React.Component<IProps> {
  static path = "/my-urls"

  render() {
    const {
      authenticationIsValid,
      exitAccount,
      fetchUrlCollection,
      fetchUrlDailyHits,
      fetchUrlTotalHits,
      isFetchingUrlCollection,
      removeUrlFromCollection,
      removingUrlId,
      selectedUrlCollectionId,
      urlCollection,
      urlsDailyHits,
      urlsTotalHits,
    } = this.props

    if (authenticationIsValid === null) {
      return null
    }

    if (authenticationIsValid === false) {
      return (
        <Redirect push to={HomePage.path}/>
      )
    }

    return (
      <>
        <Navbar
          authenticationIsValid={authenticationIsValid}
          exit={exitAccount}
          locationPath={this.props.location.pathname}
        />

        <Section>
          <Container>
            <Title>
              <FormattedMessage id="MyUrlsPage.title" />
            </Title>

            {isFetchingUrlCollection && (
              <Progress isPrimary />
            )}

            <UrlCollection
              fetchUrlCollection={fetchUrlCollection}
              fetchUrlDailyHits={fetchUrlDailyHits}
              fetchUrlTotalHits={fetchUrlTotalHits}
              removeUrl={removeUrlFromCollection(selectedUrlCollectionId)}
              removingUrlId={removingUrlId}
              urlCollection={urlCollection}
              urlsDailyHits={urlsDailyHits}
              urlsTotalHits={urlsTotalHits}
            />
          </Container>
        </Section>
      </>
    )
  }
}

const mapStateToProps = ({
  account: {
    authentication,
  },
  analytics: {
    urlsDailyHits,
    urlsTotalHits,
  },
  urlCollections: {
    creatingUrl,
    currentUrlCollection,
    fetchingUrlMetadata,
    isFetchingUrlCollection,
    removingUrlId,
    selectedUrlCollectionId,
    wantedUrl,
    wantedUrlHrefIsValid,
    wantedUrlIdExists,
  },
}) => ({
  authenticationIsValid: authentication === null ? null : authentication.isValid,
  creatingUrl,
  fetchingUrlMetadata,
  isFetchingUrlCollection,
  removingUrlId,
  selectedUrlCollectionId,
  urlCollection: currentUrlCollection,
  urlsDailyHits,
  urlsTotalHits,
  wantedUrl,
  wantedUrlHrefIsValid,
  wantedUrlIdExists,
})

const mapDispatchToProps = (dispatch) => ({
  exitAccount: () => dispatch(exitAccount()),
  fetchUrlCollection: () => dispatch(fetchUrlCollectionIfNeeded()),
  fetchUrlDailyHits: (urlId, day) => dispatch(fetchUrlDailyHitsIfNeeded(urlId, day)),
  fetchUrlTotalHits: (urlId) => dispatch(fetchUrlTotalHitsIfNeeded(urlId)),
  removeUrlFromCollection: (urlCollectionId) => (urlId) => () => dispatch(removeUrlFromCollection(urlCollectionId, urlId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MyUrlsPage)
