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
  exit,
  IAuthenticationState,
} from "../reducers/authentication"

interface IProps {
  authentication: IAuthenticationState
}

class Homepage extends React.Component<IProps> {
  static path = "/"

  render() {
    const {
      authentication,
    } = this.props

    return (
      <React.Fragment>
        <Navbar
          authenticationIsValid={authentication.isValid}
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
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  authentication: state.authentication
})

const mapDispatchToProps = (dispatch) => ({
  exit: () => dispatch(exit()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Homepage)
