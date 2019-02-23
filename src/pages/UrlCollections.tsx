import * as React from "react"
import { connect } from "react-redux"

import Navbar from "../components/Navbar"
import UrlCollection, { IUrlCollectionProps } from "../components/UrlCollection"

import {
  exit,
  IAuthentication,
} from "../reducers/account"
import {
  fetchCollectionIfNeeded,
  ICollectionsState,
} from "../reducers/collections"

interface IProps {
  authentication: IAuthentication
  collection: ICollectionsState["current"]
  fetchCollection: IUrlCollectionProps["fetchCollection"]
  exit: () => void
}

class UrlCollections extends React.Component<IProps> {
  static path = "/url-collections"

  render() {
    const {
      authentication,
      collection,
      exit,
      fetchCollection,
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
  collection: state.collections.current,
})

const mapDispatchToProps = (dispatch) => ({
  exit: () => dispatch(exit()),
  fetchCollection: () => dispatch(fetchCollectionIfNeeded()),
})

export default connect(mapStateToProps, mapDispatchToProps)(UrlCollections)
