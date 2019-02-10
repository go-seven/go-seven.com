import * as React from "react"
import { connect } from "react-redux"

import Navbar from "../components/Navbar"
import UrlCollection from "../components/UrlCollection"
import UrlCreator from "../components/UrlCreator"

import {
  exit,
  IAuthentication,
} from "../reducers/account"
import {
  createUrl,
  fetchCollectionIfNeeded,
  ICollection,
} from "../reducers/collections"

interface IProps {
  authentication: IAuthentication
  currentCollection: ICollection
  fetchCollection: () => void
  exit: () => void
}

class Dashboard extends React.Component<IProps> {
  static path = "/dashboard"

  render() {
    const {
      authentication,
      currentCollection,
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

        <UrlCreator />

        <UrlCollection
          collection={currentCollection}
          fetchCollection={fetchCollection}
        />
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  authentication: state.account.authentication,
  currentCollection: state.collections.current,
})

const mapDispatchToProps = (dispatch) => ({
  createUrl: (url) => dispatch(createUrl(url)),
  exit: () => dispatch(exit()),
  fetchCollection: () => dispatch(fetchCollectionIfNeeded())
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
