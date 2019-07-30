import * as history from "history"
import * as React from "react"
import { connect } from "react-redux"

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
  authenticationIsValid: null | boolean
  exitAccount: () => void
  location: history.Location
  fetchUrlCollection: IUrlCollectionProps["fetchUrlCollection"]
  fetchingUrlMetadata: IUrlCollectionsState["fetchingUrlMetadata"]
  removeUrlFromCollection: (urlCollectionId: string) => (urlId: string) => () => void,
  removingUrlId: IUrlCollectionProps["removingUrlId"]
  urlCollection: IUrlCollectionsState["currentUrlCollection"]
}

class MyUrlsPage extends React.Component<IProps> {
  static path = "/my-urls"

  render() {
    const {
      authenticationIsValid,
      exitAccount,
      fetchUrlCollection,
      removeUrlFromCollection,
      removingUrlId,
      urlCollection,
    } = this.props

    if (authenticationIsValid === null) {
      return null
    }

    return (
      <>
        <Navbar
          authenticationIsValid={authenticationIsValid}
          exit={exitAccount}
          locationPath={this.props.location.pathname}
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

const mapStateToProps = ({
  account: {
    authentication,
  },
  urlCollections: {
    creatingUrl,
    currentUrlCollection,
    fetchingUrlMetadata,
    removingUrlId,
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
    removingUrlId,
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
