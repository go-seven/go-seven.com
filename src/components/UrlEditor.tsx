import * as React from "react"
import {
  Box,
  Control,
  Field,
  Input,
  Label,
  Tag,
} from "trunx"

import {
  IUrl,
} from "../reducers/urlCollections"

interface IProps {
  currentUrl: IUrl | null
  fetchingUrlMetadata: boolean
  fetchUrlMetadata: (IUrl) => void
  url: IUrl
}

export default class UrlEditor extends React.Component<IProps> {
  componentDidMount() {
    const {
      fetchUrlMetadata,
      url,
    } = this.props

    fetchUrlMetadata(url)
  }

  render() {
    const {
      currentUrl,
      fetchingUrlMetadata,
      url,
    } = this.props

    return (
      <Box>
        <Field>
          <Control>
            <Tag
              href={url.href}
              isLink
              target="_blank"
            >
              {url.id}
            </Tag>
          </Control>
        </Field>

        <Field>
          <Label>
            Original URL
          </Label>

          <Control
            isLoading={fetchingUrlMetadata}
          >
            <Input
              isSuccess={(currentUrl !== null && currentUrl.metadata && currentUrl.metadata.statusCode === 200)}
              readOnly
              type="text"
              value={url.href}
            />
          </Control>
        </Field>

        <Field>
          <Label>
            URL Title
          </Label>

          <Control>
            <Input
              readOnly
              type="text"
              value={url.title}
            />
          </Control>
        </Field>

        <Field>
          <Label>
            Original URL Title
          </Label>

          <Control
            isLoading={fetchingUrlMetadata}
          >
            <Input
              readOnly
              type="text"
              value={(currentUrl !== null && currentUrl.metadata) ? currentUrl.metadata.title : ""}
            />
          </Control>
        </Field>
      </Box>
    )
  }
}
