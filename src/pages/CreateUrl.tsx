import * as React from "react"
import { connect } from "react-redux"

import Navbar from "../components/Navbar"
import UrlCreator, { IUrlCreatorProps } from "../components/UrlCreator"

import {
  exit,
  IAuthentication,
} from "../reducers/account"
import {
  createUrl,
  setWantedUrl,
  ICollectionsState,
} from "../reducers/collections"

interface IProps {
  authentication: IAuthentication
  createUrl: IUrlCreatorProps["createUrl"]
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
      createUrl,
      exit,
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
  setWantedUrl: (url) => dispatch(setWantedUrl(url)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateUrl)
