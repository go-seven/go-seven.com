import * as React from 'react'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import {
  Column,
  Columns,
  Container,
  Footer,
  Tag,
  Tags
} from 'trunx'

import pagePath from '../pages/paths'

export default function () {
  return (
    <Footer>
      <Container>
        <Columns>
          <Column is4>
            <Tags hasAddons>
              <Tag isDark>Sugar</Tag>

              <Tag isInfo>free</Tag>
            </Tags>

            <p>
              <FormattedHTMLMessage id="Footer.sugar-free.message" />
            </p>
          </Column>

          <Column is6 isOffset2>
            <Tags>
              <Tag
                isDark
                href={pagePath.privacyPolicy()}
                target="_blank"
              >
                <FormattedMessage id="PrivacyPolicyPage.title" />
              </Tag>

              <Tag
                isDark
                href={pagePath.termsOfService()}
                target="_blank"
              >
                <FormattedMessage id="TermsOfServicePage.title" />
              </Tag>
            </Tags>
          </Column>
        </Columns>
      </Container>
    </Footer>
  )
}
