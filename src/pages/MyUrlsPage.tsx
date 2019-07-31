import * as history from "history"
import * as React from "react"
import { connect } from "react-redux"
import { Redirect } from "react-router-dom"

import HomePage from "./HomePage"

import Navbar from "../components/Navbar"
import UrlCollection, { IUrlCollectionProps } from "../components/UrlCollection"

import {
  exitAccount,
} from "../reducers/account"
import {
  fetchUrlCollectionIfNeeded,
  removeUrlFromCollection,
  IUrlCollectionsState,
} from "../reducers/urlCollections"

interface IProps {
  authenticationIsValid: boolean
  exitAccount: () => void
  location: history.Location
  fetchUrlCollection: IUrlCollectionProps["fetchUrlCollection"]
  fetchingUrlMetadata: IUrlCollectionsState["fetchingUrlMetadata"]
  isFetchingUrlCollection: boolean
  removeUrlFromCollection: (urlCollectionId: string) => (urlId: string) => () => void,
  removingUrlId: IUrlCollectionProps["removingUrlId"]
  selectedUrlCollectionId: string
  urlCollection: IUrlCollectionsState["currentUrlCollection"]
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

        <UrlCollection
          fetchUrlCollection={fetchUrlCollection}
          isFetchingUrlCollection={isFetchingUrlCollection}
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
  const authenticationIsValid = authentication === null ? false : authentication.isValid

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
