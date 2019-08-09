import * as React from "react"
import { FormattedHTMLMessage, FormattedMessage } from "react-intl"
import {
  Container,
  Content,
  Section,
  Title
} from "trunx"

export default function() {
  return (
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
              <b>Mobile first!</b> Use it from your mobile phone or any device, it is <a href="https://en.wikipedia.org/wiki/Responsive_web_design" rel="noopener" target="_blank">designed to be responsive</a>.
            </li>

            <li>
              Rock solid engine, relying on <a href="https://aws.amazon.com/cloudfront/" rel="noopener" target="_blank">Amazon Cloudfront</a>: practically it will be 99.9&#37; online.
            </li>

            <li>
              Short URLs are served securely using <strong>https</strong> scheme. A short URL using http schema is allowed and it will be routed to safe https.
            </li>

            <li>
              Customized short link. By default a random link is generated, but you can also set a custom string.

              {/*
              <ul>
                <li><a href="//go7.li/⚡" rel="noopener" target="_blank">go7.li/⚡</a></li>

                <li><a href="//go7.li/😢" rel="noopener" target="_blank">go7.li/😢</a></li>
              </ul>
              */}
            </li>

            <li>Short URL title is copied from your target URL.</li>

            <li><em>Near real time</em> analytics: data is updated every few minutes.</li>

            <li>Analytics are private. You need to access with your email and password to manage your URLs and access your data.</li>

            {/*
            <li>Analytics are never deleted and <a href="https://en.wikipedia.org/wiki/Data_anonymization" rel="noopener" target="_blank">data is anonymized</a>.</li>
            */}
          </ul>
        </Content>
      </Container>
    </Section>
  )
}
