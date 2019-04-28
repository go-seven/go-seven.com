import * as React from "react"
import { FormattedMessage } from "react-intl"
import {
  Container,
  Content,
  Section,
  Title,
} from "trunx"

import Footer from "../components/Footer"
import Navbar from "../components/Navbar"

export default class PrivacyPolicyPage extends React.Component {
  static path = "/privacy-policy"

  render() {
    return (
      <React.Fragment>
        <Navbar noMenu />

        <Section>
          <Container>
            <Title>
              <FormattedMessage id={"PrivacyPolicyPage.title"} />
            </Title>

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
