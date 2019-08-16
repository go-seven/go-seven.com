import * as React from 'react'
import { FormattedMessage } from 'react-intl'
import { RouteComponentProps } from 'react-router-dom'
import {
  Container,
  Section,
  Title
} from 'trunx'

import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

interface IProps extends RouteComponentProps {
}

export default class TermsOfServicePage extends React.Component<IProps> {
  static path = '/terms-of-service'

  render () {
    return (
      <>
        <Navbar
          locationPath={this.props.location.pathname}
          noMenu
        />

        <Section>
          <Container>
            <Title>
              <FormattedMessage id={'TermsOfServicePage.title'} />
            </Title>

            <Title is4>
              <FormattedMessage id={'TermsOfServicePage.downgrades.title'} />
            </Title>

            <p>
              <FormattedMessage id={'TermsOfServicePage.downgrades.paragraph'} />
            </p>
          </Container>
        </Section>

        <Footer />
      </>
    )
  }
}
