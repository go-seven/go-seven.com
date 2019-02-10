import * as React from "react"
import {
  Card,
  Tag,
} from "trunx"

interface IProps {
  url
}

export default class UrlCard extends React.Component<IProps> {
  render() {
    const {
      url,
    } = this.props

    return (
      <Card>
        <Card.Header>
          <Card.Header.Title>
            <Tag
              href={url.href}
              target="_blank"
            >
              {url.id}
            </Tag>
          </Card.Header.Title>
        </Card.Header>

        <Card.Content>
          <span>
            {url.title}
          </span>
        </Card.Content>
      </Card>
    )
  }
}
