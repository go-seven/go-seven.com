import * as solidIcon from "fa-svg-icon/solid"
import * as React from "react"
import {
  Box,
  Control,
  Field,
  Icon,
  Input,
  Label,
  Tag,
  Tags,
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
            <Tags hasAddons>
              <Tag>
                {url.id}
              </Tag>

              <Tag
                href={url.href}
                isLink
                onClick={(event) => { event.stopPropagation() }}
                target="_blank"
              >
                <Icon>
                  <Icon.Svg
                    icon={solidIcon.externalLinkSquareAlt}
                  />
                </Icon>
              </Tag>
            </Tags>
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
