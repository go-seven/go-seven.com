import * as React from "react"
import { connect } from "react-redux"

import Navbar from "../components/Navbar"
import UrlCollections from "../components/UrlCollections"
import UrlCreator from "../components/UrlCreator"

import {
  exit,
  IAuthentication,
} from "../reducers/account"
import {
  createUrl,
  fetchCollectionIfNeeded,
} from "../reducers/collections"

interface IProps {
  authentication: IAuthentication
  fetchCollection: () => void
  exit: () => void
}

class Dashboard extends React.Component<IProps> {
  static path = "/dashboard"

  render() {
    const {
      authentication,
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

        <UrlCollections
          fetchCollection={fetchCollection}
        />
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  authentication: state.account.authentication
})

const mapDispatchToProps = (dispatch) => ({
  createUrl: (url) => dispatch(createUrl(url)),
  exit: () => dispatch(exit()),
  fetchCollection: () => dispatch(fetchCollectionIfNeeded())
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
