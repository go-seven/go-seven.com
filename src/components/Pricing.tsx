import * as React from "react"
import { FormattedMessage } from "react-intl"
import {
  Container,
  Content,
  Section,
  Subtitle,
  Tile,
  Title
} from "trunx"

export default function() {
  return (
    <Section>
      <Container>
        <Title>
          <FormattedMessage id="Pricing.title" />
        </Title>

        <Tile.Ancestor>
          <Tile isParent>
            <Tile.Child.Box>
              <Title>
                <FormattedMessage id="Pricing.free.title" />
              </Title>

              <Subtitle>
                <FormattedMessage id="Pricing.free.subtitle" />
              </Subtitle>

              <Content>
                <ul>
                  <li>
                    <FormattedMessage id="Pricing.free.unlimited-urls" />
                  </li>

                  <li>
                    <FormattedMessage id="Pricing.free.analytics" />
                  </li>
                </ul>
              </Content>
            </Tile.Child.Box>
          </Tile>

          <Tile isParent>
            <Tile.Child.Box>
              <Title>
                <FormattedMessage id="Pricing.pro.title" />
              </Title>

              <Subtitle>
                <FormattedMessage id="Pricing.pro.subtitle" />
              </Subtitle>

              <Content>
                <ul>
                  <li>
                    <FormattedMessage id="Pricing.pro.unlimited-analytics" />
                  </li>
                </ul>
              </Content>
            </Tile.Child.Box>
          </Tile>
        </Tile.Ancestor>
      </Container>
    </Section>
  )
}
