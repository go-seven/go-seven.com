import * as React from "react"
import { FormattedMessage } from "react-intl"
import {
  Container,
  Section,
  Title,
} from "trunx"

import Footer from "../components/Footer"
import Navbar from "../components/Navbar"

export default class TermsOfServicePage extends React.Component {
  static path = "/terms-of-service"

  render() {
    return (
      <React.Fragment>
        <Navbar noMenu />

        <Section>
          <Container>
            <Title>
              <FormattedMessage id={"TermsOfServicePage.title"} />
            </Title>

          </Container>
        </Section>

        <Footer />
      </React.Fragment>
    )
  }
}
