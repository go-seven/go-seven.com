import * as React from "react"
import {
  Container,
  Content,
  Section,
  Title,
} from "trunx"

import Footer from "../components/Footer"
import Navbar from "../components/Navbar"

export default class PrivacyPolicy extends React.Component {
  static path = "/privacy-policy"

  render() {
    return (
      <React.Fragment>
        <Navbar />

        <Section>
          <Container>
            <Title>Privacy Policy</Title>

            <Content>
              We take your privacy very seriously. This policy describes all information collected or submitted on the GoSeven platform, and what we do with it.
            </Content>
          </Container>
        </Section>

        <Footer />
      </React.Fragment>
    )
  }
}
