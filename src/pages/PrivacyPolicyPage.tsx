import * as React from "react"
import { FormattedMessage } from "react-intl"
import { RouteComponentProps } from "react-router-dom"
import {
  Container,
  Content,
  Section,
  Title,
} from "trunx"

import Footer from "../components/Footer"
import Navbar from "../components/Navbar"

interface IProps extends RouteComponentProps {
}

export default class PrivacyPolicyPage extends React.Component<IProps> {
  static path = "/privacy-policy"

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
              <FormattedMessage id={"PrivacyPolicyPage.title"} />
            </Title>

            <Content>
              We take your privacy very seriously. This policy describes all information collected or submitted on the GoSeven platform, and what we do with it.
            </Content>
          </Container>
        </Section>

        <Footer />
      </>
    )
  }
}
