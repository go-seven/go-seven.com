import * as history from "history"
import * as React from "react"
import { FormattedMessage } from "react-intl"
import {
  Container,
  Section,
  Title,
} from "trunx"

import Footer from "../components/Footer"
import Navbar from "../components/Navbar"

interface IProps {
  location: history.Location
}

export default class TermsOfServicePage extends React.Component<IProps> {
  static path = "/terms-of-service"

  render() {
    return (
      <>
        <Navbar
          locationPath={this.props.location.pathname}
          noMenu
        />

        <Section>
          <Container>
            <Title>
              <FormattedMessage id={"TermsOfServicePage.title"} />
            </Title>

          </Container>
        </Section>

        <Footer />
      </>
    )
  }
}
