import * as history from "history"
import * as React from "react"
import { connect } from "react-redux"
import {
  Container,
  Hero,
  Subtitle,
  Title,
} from "trunx"

import Features from "../components/Features"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import Pricing from "../components/Pricing"

import {
  exitAccount,
} from "../reducers/account"

interface IProps {
  authenticationIsValid: boolean
  exitAccount: () => void
  location: history.Location
}

class HomePage extends React.Component<IProps> {
  static path = "/"

  render() {
    const {
      authenticationIsValid,
      exitAccount,
    } = this.props

    return (
      <>
        <Navbar
          authenticationIsValid={authenticationIsValid}
          locationPath={this.props.location.pathname}
          exit={exitAccount}
        />

        <Hero isPrimary>
          <Hero.Body>
            <Container>
              <Title>GoSeven</Title>
              <Subtitle>Url shortener</Subtitle>
            </Container>
          </Hero.Body>
        </Hero>

        <Features />

        <Pricing />

        <Footer />
      </>
    )
  }
}

const mapStateToProps = (state) => {
  const {
    account,
  } = state

  const {
    authentication,
  } = account

  const authenticationIsValid = authentication === null ? false : authentication.isValid

  return {
    authenticationIsValid,
  }
}

const mapDispatchToProps = (dispatch) => ({
  exitAccount: () => dispatch(exitAccount()),
})

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)
