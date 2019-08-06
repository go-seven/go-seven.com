import * as React from "react"
import { connect } from "react-redux"
import { Redirect, RouteComponentProps } from "react-router-dom"
import {
  Progress,
  Section,
} from "trunx"

import HomePage from "./HomePage"

import Navbar from "../components/Navbar"
import UrlCollection, { IUrlCollectionProps } from "../components/UrlCollection"

import {
  exitAccount,
} from "../reducers/account"
import {
  fetchUrlCollectionIfNeeded,
  removeUrlFromCollection,
  IUrlCollection,
} from "../reducers/urlCollections"

interface IProps extends RouteComponentProps {
  authenticationIsValid: boolean | null
  exitAccount: () => void
  fetchUrlCollection: IUrlCollectionProps["fetchUrlCollection"]
  fetchingUrlMetadata: boolean
  isFetchingUrlCollection: boolean
  removeUrlFromCollection: (urlCollectionId: string) => (urlId: string) => () => void,
  removingUrlId: string
  selectedUrlCollectionId: string
  urlCollection: IUrlCollection | null
}

class MyUrlsPage extends React.Component<IProps> {
  static path = "/my-urls"

  render() {
    const {
      authenticationIsValid,
      exitAccount,
      fetchUrlCollection,
      isFetchingUrlCollection,
      removeUrlFromCollection,
      removingUrlId,
      selectedUrlCollectionId,
      urlCollection,
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

        {isFetchingUrlCollection && (
          <Section>
            <Progress isPrimary />
          </Section>
        )}

        <UrlCollection
          fetchUrlCollection={fetchUrlCollection}
          removeUrl={removeUrlFromCollection(selectedUrlCollectionId)}
          removingUrlId={removingUrlId}
          urlCollection={urlCollection}
        />
      </>
    )
  }
}

const mapStateToProps = ({
  account: {
    authentication,
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
}) => {
  const authenticationIsValid = authentication === null ? null : authentication.isValid

  return {
    authenticationIsValid,
    creatingUrl,
    fetchingUrlMetadata,
    isFetchingUrlCollection,
    removingUrlId,
    selectedUrlCollectionId,
    urlCollection: currentUrlCollection,
    wantedUrl,
    wantedUrlHrefIsValid,
    wantedUrlIdExists,
  }
}

const mapDispatchToProps = (dispatch) => ({
  exitAccount: () => dispatch(exitAccount()),
  fetchUrlCollection: () => dispatch(fetchUrlCollectionIfNeeded()),
  removeUrlFromCollection: (urlCollectionId) => (urlId) => () => dispatch(removeUrlFromCollection(urlCollectionId, urlId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MyUrlsPage)
