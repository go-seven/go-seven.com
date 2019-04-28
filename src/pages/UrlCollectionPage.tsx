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
  fetchCollectionIfNeeded,
  setWantedUrl,
  ICollectionsState,
} from "../reducers/collections"

interface IProps {
  authentication: IAuthentication
  checkingIfUrlIdExists: ICollectionsState["checkingIfUrlIdExists"]
  collection: ICollectionsState["current"]
  createUrl: IUrlCreatorProps["createUrl"]
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
      <React.Fragment>
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
          fetchCollection={fetchCollection}
        />
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  authentication: state.account.authentication,
  checkingIfUrlIdExists: state.collections.checkingIfUrlIdExists,
  collection: state.collections.current,
  creatingUrl: state.collections.creatingUrl,
  fetchingUrlMetadata: state.collections.fetchingUrlMetadata,
  wantedUrl: state.collections.wantedUrl,
  wantedUrlHrefIsValid: state.collections.wantedUrlHrefIsValid,
  wantedUrlIdExists: state.collections.wantedUrlIdExists,
})

const mapDispatchToProps = (dispatch) => ({
  createUrl: (url) => dispatch(createUrl(url)),
  exit: () => dispatch(exit()),
  fetchCollection: () => dispatch(fetchCollectionIfNeeded()),
  setWantedUrl: (url) => dispatch(setWantedUrl(url)),
})

export default connect(mapStateToProps, mapDispatchToProps)(UrlCollectionPage)
