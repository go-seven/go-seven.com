import * as React from "react"
import {
  Container,
  Section,
  Title,
} from "trunx"

import Footer from "../components/Footer"
import Navbar from "../components/Navbar"

export default class Homepage extends React.Component {
  static path = "/terms-of-service"

  render() {
    return (
      <React.Fragment>
        <Navbar noMenu />

        <Section>
          <Container>
            <Title>Terms of Service</Title>
          </Container>
        </Section>

        <Footer />
      </React.Fragment>
    )
  }
}
