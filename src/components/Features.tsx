import * as React from "react"
import { useEffect, useState } from "react"
import { FormattedHTMLMessage, FormattedMessage } from "react-intl"
import { useSpring, animated } from "react-spring"
import {
  Container,
  Content,
  Section,
  Title
} from "trunx"

export default function() {
  const [ componentDidMount, setComponentDidMount ] = useState(false)
  useEffect(() => setComponentDidMount(true), [])

  const props = useSpring({ opacity: 1, from: { opacity: componentDidMount ? 1 : 0 }, delay: 1000, config: { duration: 1000 }})

  return (
    <animated.div
      style={props}
    >
      <Section>
        <Container>
          <Title>
            <FormattedMessage id="Features.title" />
          </Title>

          <Content>
            <ul>
              <li>
                <FormattedHTMLMessage id="Features.list.fast-and-easy" />
              </li>

              <li>
                <FormattedHTMLMessage id="Features.list.privacy-safe" />
              </li>

              <li>
                <FormattedHTMLMessage id="Features.list.mobile-first" />
              </li>

              <li>
                <FormattedHTMLMessage id="Features.list.engine" />
              </li>

              <li>
                <FormattedHTMLMessage id="Features.list.secure" />
              </li>
              {/*

              <li>
                Customized short link. By default a random link is generated, but you can also set a custom string.

                <ul>
                  <li><a href="//go7.li/⚡" rel="noopener" target="_blank">go7.li/⚡</a></li>

                  <li><a href="//go7.li/😢" rel="noopener" target="_blank">go7.li/😢</a></li>
                </ul>
              </li>

              <li>Short URL title is copied from your target URL.</li>

              <li>Analytics are private. You need to access with your email and password to manage your URLs and access your data.</li>

              <li>Analytics are never deleted and <a href="https://en.wikipedia.org/wiki/Data_anonymization" rel="noopener" target="_blank">data is anonymized</a>.</li>
              */}

              <li>
                <FormattedHTMLMessage id="Features.list.near-real-time" />
              </li>
            </ul>
          </Content>
        </Container>
      </Section>
    </animated.div>
  )
}
