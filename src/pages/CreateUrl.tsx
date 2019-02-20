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
  createUrl: IUrlCreatorProps["createUrl"]
  collection: ICollectionsState["current"]
  fetchCollection: IUrlCollectionProps["fetchCollection"]
  exit: () => void
  itIsCheckingIfUrlIdExists: ICollectionsState["itIsCheckingIfUrlIdExists"]
  itIsCreatingUrl: ICollectionsState["itIsCreatingUrl"]
  itIsFetchingUrlMetadata: ICollectionsState["itIsFetchingUrlMetadata"]
  setWantedUrl: IUrlCreatorProps["setWantedUrl"]
  wantedUrl: ICollectionsState["wantedUrl"]
  wantedUrlHrefIsValid: ICollectionsState["wantedUrlHrefIsValid"]
  wantedUrlIdExists: ICollectionsState["wantedUrlIdExists"]
}

class CreateUrl extends React.Component<IProps> {
  static path = "/create-url"

  render() {
    const {
      authentication,
      collection,
      createUrl,
      exit,
      fetchCollection,
      itIsCheckingIfUrlIdExists,
      itIsCreatingUrl,
      itIsFetchingUrlMetadata,
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
          itIsCheckingIfUrlIdExists={itIsCheckingIfUrlIdExists}
          itIsCreatingUrl={itIsCreatingUrl}
          itIsFetchingUrlMetadata={itIsFetchingUrlMetadata}
          setWantedUrl={setWantedUrl}
          wantedUrl={wantedUrl}
          wantedUrlIdExists={wantedUrlIdExists}
          wantedUrlHrefIsValid={wantedUrlHrefIsValid}
        />
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  authentication: state.account.authentication,
  collection: state.collections.current,
  itIsCheckingIfUrlIdExists: state.collections.itIsCheckingIfUrlIdExists,
  itIsCreatingUrl: state.collections.itIsCreatingUrl,
  itIsFetchingUrlMetadata: state.collections.itIsFetchingUrlMetadata,
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateUrl)
