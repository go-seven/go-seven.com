import * as React from "react"
import { connect } from "react-redux"

import Navbar from "../components/Navbar"
import UrlCollection, { IUrlCollectionProps } from "../components/UrlCollection"
import UrlCreator, { IUrlCreatorProps } from "../components/UrlCreator"

import {
  exitAccount,
} from "../reducers/account"
import {
  createUrl,
  fetchUrlCollectionIfNeeded,
  removeUrlFromCollection,
  setWantedUrl,
  IUrlCollectionsState,
} from "../reducers/urlCollections"

interface IProps {
  authenticationIsValid: null | boolean
  checkingIfUrlIdExists: IUrlCollectionsState["checkingIfUrlIdExists"]
  creatingUrl: IUrlCollectionsState["creatingUrl"]
  createUrl: IUrlCreatorProps["createUrl"]
  exitAccount: () => void
  fetchUrlCollection: IUrlCollectionProps["fetchUrlCollection"]
  fetchingUrlMetadata: IUrlCollectionsState["fetchingUrlMetadata"]
  setWantedUrl: IUrlCreatorProps["setWantedUrl"]
  removeUrlFromCollection: (urlCollectionId: string) => (urlId: string) => () => void,
  removingUrlId: IUrlCollectionProps["removingUrlId"]
  urlCollection: IUrlCollectionsState["currentUrlCollection"]
  wantedUrl: IUrlCollectionsState["wantedUrl"]
  wantedUrlHrefIsValid: IUrlCollectionsState["wantedUrlHrefIsValid"]
  wantedUrlIdExists: IUrlCollectionsState["wantedUrlIdExists"]
}

class MyUrlsPage extends React.Component<IProps> {
  static path = "/my-urls"

  render() {
    const {
      authenticationIsValid,
      createUrl,
      exitAccount,
      fetchingUrlMetadata,
      fetchUrlCollection,
      checkingIfUrlIdExists,
      creatingUrl,
      removeUrlFromCollection,
      removingUrlId,
      setWantedUrl,
      urlCollection,
      wantedUrl,
      wantedUrlHrefIsValid,
      wantedUrlIdExists,
    } = this.props

    if (authenticationIsValid === null) {
      return null
    }

    return (
      <>
        <Navbar
          authenticationIsValid={authenticationIsValid}
          exit={exitAccount}
        />

        <UrlCreator
          createUrl={createUrl}
          checkingIfUrlIdExists={checkingIfUrlIdExists}
          creatingUrl={creatingUrl}
          fetchingUrlMetadata={fetchingUrlMetadata}
          setWantedUrl={setWantedUrl}
          wantedUrl={wantedUrl}
          wantedUrlIdExists={wantedUrlIdExists}
          wantedUrlHrefIsValid={wantedUrlHrefIsValid}
        />

        {urlCollection && (
          <UrlCollection
            urlCollection={urlCollection}
            removeUrl={removeUrlFromCollection(urlCollection.id)}
            removingUrlId={removingUrlId}
            fetchUrlCollection={fetchUrlCollection}
          />
        )}
      </>
    )
  }
}

const mapStateToProps = (state) => {
  const {
    account,
    urlCollections,
  } = state

  const {
    authentication
  } = account

  const {
    checkingIfUrlIdExists,
    creatingUrl,
    currentUrlCollection,
    fetchingUrlMetadata,
    removingUrlId,
    wantedUrl,
    wantedUrlHrefIsValid,
    wantedUrlIdExists,
  } = urlCollections

  const authenticationIsValid = authentication === null ? null : authentication.isValid

  return {
    authenticationIsValid,
    checkingIfUrlIdExists,
    creatingUrl,
    fetchingUrlMetadata,
    removingUrlId,
    urlCollection: currentUrlCollection,
    wantedUrl,
    wantedUrlHrefIsValid,
    wantedUrlIdExists,
  }
}

const mapDispatchToProps = (dispatch) => ({
  createUrl: (url) => dispatch(createUrl(url)),
  exitAccount: () => dispatch(exitAccount()),
  fetchUrlCollection: () => dispatch(fetchUrlCollectionIfNeeded()),
  removeUrlFromCollection: (urlCollectionId) => (urlId) => () => dispatch(removeUrlFromCollection(urlCollectionId, urlId)),
  setWantedUrl: (url) => dispatch(setWantedUrl(url)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MyUrlsPage)
