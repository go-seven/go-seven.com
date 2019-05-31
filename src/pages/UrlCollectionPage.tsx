import * as React from "react"
import { connect } from "react-redux"

import Navbar from "../components/Navbar"
import UrlCollection, { IUrlCollectionProps } from "../components/UrlCollection"
import UrlCreator, { IUrlCreatorProps } from "../components/UrlCreator"

import {
  exit,
  IAuthentication,
} from "../reducers/account"
import {
  createUrl,
  deleteUrl,
  fetchCollectionIfNeeded,
  setWantedUrl,
  ICollectionsState,
} from "../reducers/collections"

interface IProps {
  authentication: IAuthentication
  checkingIfUrlIdExists: ICollectionsState["checkingIfUrlIdExists"]
  collection: ICollectionsState["current"]
  createUrl: IUrlCreatorProps["createUrl"]
  deleteUrl: IUrlCollectionProps["deleteUrl"]
  deletingUrlId: IUrlCollectionProps["deletingUrlId"]
  creatingUrl: ICollectionsState["creatingUrl"]
  exit: () => void
  fetchCollection: IUrlCollectionProps["fetchCollection"]
  fetchingUrlMetadata: ICollectionsState["fetchingUrlMetadata"]
  setWantedUrl: IUrlCreatorProps["setWantedUrl"]
  wantedUrl: ICollectionsState["wantedUrl"]
  wantedUrlHrefIsValid: ICollectionsState["wantedUrlHrefIsValid"]
  wantedUrlIdExists: ICollectionsState["wantedUrlIdExists"]
}

class UrlCollectionPage extends React.Component<IProps> {
  static path = "/url-collection"

  render() {
    const {
      authentication,
      collection,
      createUrl,
      deleteUrl,
      deletingUrlId,
      exit,
      fetchCollection,
      checkingIfUrlIdExists,
      creatingUrl,
      fetchingUrlMetadata,
      setWantedUrl,
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
          exit={exit}
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

        <UrlCollection
          collection={collection}
          deleteUrl={deleteUrl}
          deletingUrlId={deletingUrlId}
          fetchCollection={fetchCollection}
        />
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  authentication: state.account.authentication,
  checkingIfUrlIdExists: state.collections.checkingIfUrlIdExists,
  collection: state.collections.current,
  creatingUrl: state.collections.creatingUrl,
  deletingUrlId: state.collections.deletingUrlId,
  fetchingUrlMetadata: state.collections.fetchingUrlMetadata,
  wantedUrl: state.collections.wantedUrl,
  wantedUrlHrefIsValid: state.collections.wantedUrlHrefIsValid,
  wantedUrlIdExists: state.collections.wantedUrlIdExists,
})

const mapDispatchToProps = (dispatch) => ({
  createUrl: (url) => dispatch(createUrl(url)),
  deleteUrl: (id) => dispatch(deleteUrl(id)),
  exit: () => dispatch(exit()),
  fetchCollection: () => dispatch(fetchCollectionIfNeeded()),
  setWantedUrl: (url) => dispatch(setWantedUrl(url)),
})

export default connect(mapStateToProps, mapDispatchToProps)(UrlCollectionPage)
