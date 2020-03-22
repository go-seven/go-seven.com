import * as React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Container,
  Content,
  Section,
  Title
} from 'trunx'

import { Footer } from '../components/Footer'
import Navbar from '../components/Navbar'

export default function PrivacyPolicyPage () {
  return (
    <>
      <Navbar
        noMenu
      />

      <Section>
        <Container>
          <Content>
            <Title>
              <FormattedMessage id={'PrivacyPolicyPage.title'} />
            </Title>

            <p>
              <FormattedMessage id={'PrivacyPolicyPage.intro'} />
            </p>

            <Title is4>
              <FormattedMessage id={'PrivacyPolicyPage.changes.title'} />
            </Title>

            <p>
              <FormattedMessage id={'PrivacyPolicyPage.changes.paragraph'} />
            </p>
          </Content>
        </Container>
      </Section>

      <Footer />
    </>
  )
}
