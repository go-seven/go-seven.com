import * as solidIcon from "fa-svg-icon/solid"
import * as pdsp from "pdsp"
import * as React from "react"
import { useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"
import InjectIntl from "react-intl-inject"
import {
  Box,
  Button,
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

export interface IUrlEditorProps {
  currentUrl: IUrl | null
  fetchingUrlMetadata: boolean
  fetchUrlMetadata: (IUrl) => void
  updateUrl: (url: IUrl) => void
  updatingUrl: boolean
  url: IUrl
}

export default function UrlEditor ({
  currentUrl,
  fetchUrlMetadata,
  fetchingUrlMetadata,
  updateUrl,
  updatingUrl,
  url,
}: IUrlEditorProps) {
  const [wantedTitle, setWantedTitle] = useState(url.title)

  useEffect(() => {
    fetchUrlMetadata(url)
  }, [])


  const onChangeTitle = (event) => {
    pdsp(event)

    setWantedTitle(event.target.value)
  }

  const onSubmit = (event) => {
    pdsp(event)

    updateUrl({ ...url, title: wantedTitle })
  }

  const saveButtonDisabled = (
    fetchingUrlMetadata ||
    (url.title === wantedTitle)
  )

  return (
    <form
      onSubmit={onSubmit}
    >
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
            <FormattedMessage id="UrlEditor.target-url.label" />
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
            <FormattedMessage id="UrlEditor.target-url-title.label" />
          </Label>

          <Control
          >
            <div className="url-editor__target-url-title">
              {(currentUrl !== null && currentUrl.metadata) ? currentUrl.metadata.title : ""}
            </div>
          </Control>
        </Field>

        <Field>
          <Label>
            <FormattedMessage id="UrlEditor.short-url-title.label" />
          </Label>

          <Control>
            <Input
              onChange={onChangeTitle}
              type="text"
              value={wantedTitle}
            />
          </Control>
        </Field>

        <Field>
          <Control>
            <InjectIntl>
              {({ intl }) => (
                <Button
                  disabled={saveButtonDisabled}
                  isLoading={updatingUrl}
                  isSuccess={!saveButtonDisabled}
                  type="submit"
                  value={intl.formatMessage({ id: "UrlEditor.submit" })}
                />
              )}
            </InjectIntl>
          </Control>
        </Field>
      </Box>
    </form>
  )
}
