import * as React from "react"
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
        <Title>Pricing</Title>

        <Tile.Ancestor>
          <Tile isParent>
            <Tile.Child.Box>
              <Title>Free</Title>

              <Subtitle>try it!</Subtitle>

              <Content>
                <ul>
                  <li>Unlimited links.</li>

                  <li>Number of total clicks.</li>
                </ul>
              </Content>
            </Tile.Child.Box>
          </Tile>

          <Tile isParent>
            <Tile.Child.Box>
              <Title>Pro</Title>

              <Subtitle>coming soon</Subtitle>

              <Content>
                <ul>
                  <li>Unlimited links.</li>

                  <li>Number of total clicks.</li>
                </ul>
              </Content>
            </Tile.Child.Box>
          </Tile>
        </Tile.Ancestor>
      </Container>
    </Section>
  )
}
