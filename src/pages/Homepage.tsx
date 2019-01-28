import * as React from "react"
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

export default class Homepage extends React.Component {
  static path = "/"

  render() {
    return (
      <React.Fragment>
        <Navbar />

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
