import * as React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Container,
  Section,
  Title
} from 'trunx'

import { Footer } from '../components/Footer'
import Navbar from '../components/Navbar'

export default function TermsOfServicePage () {
  return (
    <>
      <Navbar
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
