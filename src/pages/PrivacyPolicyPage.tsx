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

interface IProps extends RouteComponentProps {}

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
              <FormattedMessage id={"PrivacyPolicyPage.intro"} />
            </Content>
          </Container>
        </Section>

        <Footer />
      </>
    )
  }
}
