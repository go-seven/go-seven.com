import * as React from "react"
import { connect } from "react-redux"

import Navbar from "../components/Navbar"
import UrlCollection, { IUrlCollectionProps } from "../components/UrlCollection"
import UrlCreator, { IUrlCreatorProps } from "../components/UrlCreator"

import {
  exitAccount,
  IAuthentication,
} from "../reducers/account"
import {
  createUrl,
  fetchUrlCollectionIfNeeded,
  removeUrlFromCollection,
  setWantedUrl,
  IUrlCollectionsState,
} from "../reducers/urlCollections"

interface IProps {
  authentication: IAuthentication
  checkingIfUrlIdExists: IUrlCollectionsState["checkingIfUrlIdExists"]
  createUrl: IUrlCreatorProps["createUrl"]
  removingUrlId: IUrlCollectionProps["removingUrlId"]
  creatingUrl: IUrlCollectionsState["creatingUrl"]
  exitAccount: () => void
  fetchUrlCollection: IUrlCollectionProps["fetchUrlCollection"]
  fetchingUrlMetadata: IUrlCollectionsState["fetchingUrlMetadata"]
  setWantedUrl: IUrlCreatorProps["setWantedUrl"]
  removeUrlFromCollection: (urlCollectionId: string) => (urlId: string) => () => void,
  urlCollection: IUrlCollectionsState["currentUrlCollection"]
  wantedUrl: IUrlCollectionsState["wantedUrl"]
  wantedUrlHrefIsValid: IUrlCollectionsState["wantedUrlHrefIsValid"]
  wantedUrlIdExists: IUrlCollectionsState["wantedUrlIdExists"]
}

class UrlCollectionPage extends React.Component<IProps> {
  static path = "/url-collection"

  render() {
    const {
      authentication,
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

    if (authentication === null) {
      return null
    }

    return (
      <>
        <Navbar
          authenticationIsValid={authentication.isValid}
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

const mapStateToProps = (state) => ({
  authentication: state.account.authentication,
  checkingIfUrlIdExists: state.collections.checkingIfUrlIdExists,
  creatingUrl: state.collections.creatingUrl,
  fetchingUrlMetadata: state.collections.fetchingUrlMetadata,
  removingUrlId: state.collections.removingUrlId,
  urlCollection: state.collections.currentUrlCollection,
  wantedUrl: state.collections.wantedUrl,
  wantedUrlHrefIsValid: state.collections.wantedUrlHrefIsValid,
  wantedUrlIdExists: state.collections.wantedUrlIdExists,
})

const mapDispatchToProps = (dispatch) => ({
  createUrl: (url) => dispatch(createUrl(url)),
  exitAccount: () => dispatch(exitAccount()),
  fetchUrlCollection: () => dispatch(fetchUrlCollectionIfNeeded()),
  removeUrlFromCollection: (urlCollectionId) => (urlId) => () => dispatch(removeUrlFromCollection(urlCollectionId, urlId)),
  setWantedUrl: (url) => dispatch(setWantedUrl(url)),
})

export default connect(mapStateToProps, mapDispatchToProps)(UrlCollectionPage)
