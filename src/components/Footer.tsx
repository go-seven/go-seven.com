import * as React from "react"
import {
  Column,
  Columns,
  Container,
  Footer,
  Tag,
  Tags
} from "trunx"

import PrivacyPolicyPage from "../pages/PrivacyPolicyPage"
import TermsOfServicePage from "../pages/TermsOfServicePage"

export default function() {
  return (
    <Footer>
      <Container>
        <Columns>
          <Column is4>
            <Tags hasAddons>
              <Tag isDark>Sugar</Tag>

              <Tag isInfo>free</Tag>
            </Tags>

            <p>This website does <strong>not</strong> use cookies.</p>
          </Column>

          <Column is6 isOffset2>
            <Tags>
              <Tag
                isDark
                href={PrivacyPolicyPage.path}
                target="_blank"
              >
                Privacy Policy
              </Tag>

              <Tag
                isDark
                href={TermsOfServicePage.path}
                target="_blank"
              >
                Terms of Service
              </Tag>
            </Tags>
          </Column>
        </Columns>
      </Container>
    </Footer>
  )
}
