import * as React from "react"
import { connect } from "react-redux"
import { Redirect, RouteComponentProps } from "react-router-dom"

import HomePage from "./HomePage"

import Navbar from "../components/Navbar"
import UrlCreator, { IUrlCreatorProps } from "../components/UrlCreator"

import {
  exitAccount,
} from "../reducers/account"
import {
  createUrl,
  setWantedUrl,
  IUrl,
} from "../reducers/urlCollections"

interface IProps extends RouteComponentProps {
  authenticationIsValid: boolean | null
  checkingIfUrlIdExists: boolean
  creatingUrl: boolean
  createUrl: IUrlCreatorProps["createUrl"]
  exitAccount: () => void
  fetchingUrlMetadata: boolean
  setWantedUrl: IUrlCreatorProps["setWantedUrl"]
  wantedUrl: IUrl | null
  wantedUrlHrefIsValid: boolean
  wantedUrlIdExists: boolean
}

class MyUrlsPage extends React.Component<IProps> {
  static path = "/create-url"

  render() {
    const {
      authenticationIsValid,
      checkingIfUrlIdExists,
      createUrl,
      creatingUrl,
      fetchingUrlMetadata,
      setWantedUrl,
      wantedUrl,
      wantedUrlHrefIsValid,
      wantedUrlIdExists,
    } = this.props

    if (authenticationIsValid === null) {
      return null
    }

    if (authenticationIsValid === false) {
      return (
        <Redirect push to={HomePage.path}/>
      )
    }

    return (
      <>
        <Navbar
          authenticationIsValid={authenticationIsValid}
          locationPath={this.props.location.pathname}
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

      </>
    )
  }
}

const mapStateToProps = ({
  account: {
    authentication,
  },
  urlCollections: {
    checkingIfUrlIdExists,
    creatingUrl,
    fetchingUrlMetadata,
    wantedUrl,
    wantedUrlHrefIsValid,
    wantedUrlIdExists,
  },
}) => {
  const authenticationIsValid = authentication === null ? null : authentication.isValid

  return {
    authenticationIsValid,
    checkingIfUrlIdExists,
    creatingUrl,
    fetchingUrlMetadata,
    wantedUrl,
    wantedUrlHrefIsValid,
    wantedUrlIdExists,
  }
}

const mapDispatchToProps = (dispatch) => ({
  createUrl: (url) => dispatch(createUrl(url)),
  exitAccount: () => dispatch(exitAccount()),
  setWantedUrl: (url) => dispatch(setWantedUrl(url)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MyUrlsPage)
