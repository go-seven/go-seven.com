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

import TargetUrlHrefField from "./TargetUrlHrefField"

import {
  IUrl,
} from "../reducers/urlCollections"

export interface IUrlEditorProps {
  currentUrl: IUrl | null
  fetchingUrlMetadata: boolean
  fetchUrlMetadata: (IUrl) => void
  setWantedUrl: (IUrl) => void
  updateUrl: (url: IUrl) => void
  updatingUrl: boolean
  url: IUrl
  wantedUrlHrefIsValid: boolean
}

export default function UrlEditor ({
  currentUrl,
  fetchUrlMetadata,
  fetchingUrlMetadata,
  setWantedUrl,
  updateUrl,
  updatingUrl,
  url,
  wantedUrlHrefIsValid,
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

        <InjectIntl>
          {({ intl }) => (
            <TargetUrlHrefField
              initialUrlHref={url.href}
              isLoading={fetchingUrlMetadata}
              label={intl.formatMessage({ id: "UrlEditor.target-url.label" })}
              readOnly={updatingUrl}
              resetTargetUrlHref={0}
              setTargetUrl={setWantedUrl}
              wantedUrlHrefIsValid={wantedUrlHrefIsValid}
            />
          )}
        </InjectIntl>

        {/*
          TODO show status code
          isSuccess={(currentUrl !== null && currentUrl.metadata && typeof currentUrl.metadata.statusCode === "number" && currentUrl.metadata.statusCode < 400)}
        */}

        <Field>
          <Label>
            <FormattedMessage id="UrlEditor.target-url-title.label" />
          </Label>

          <Control
          >
            <div className="url-editor__text-field--readonly">
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
          <Label>
            <FormattedMessage id="UrlEditor.short-url-title.label" />
          </Label>
          <Control>
            <div className="url-editor__text-field--readonly">
              {(currentUrl !== null && currentUrl.metadata) ? currentUrl.metadata.title : ""}
            </div>
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
