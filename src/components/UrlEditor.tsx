import * as solidIcon from 'fa-svg-icon/solid'
import pdsp from 'pdsp'
import * as React from 'react'
import { FormattedMessage } from 'react-intl'
import InjectIntl from 'react-intl-inject'
import {
  Box,
  Button,
  Control,
  Field,
  Icon,
  Input,
  Label,
  Tag,
  Tags
} from 'trunx'

import { IUrlItem } from '../model'

import ReadOnlyTextField from './ReadOnlyTextField'
import TargetUrlHrefField from './TargetUrlHrefField'

export interface IUrlEditorProps {
  currentUrl: IUrlItem | null
  fetchingUrlMetadata: boolean
  fetchUrlMetadata: (IUrlItem) => void
  setWantedUrl: (IUrl) => void
  updateUrl: (IUrlItem) => void
  updatingUrl: boolean
  url: IUrlItem
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
  wantedUrlHrefIsValid
}: IUrlEditorProps) {
  const [wantedTitle, setWantedTitle] = React.useState(url.title)

  React.useEffect(() => {
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
              label={intl.formatMessage({ id: 'UrlEditor.target-url.label' })}
              readOnly={updatingUrl}
              resetTargetUrlHref={0}
              setTargetUrlHref={(href) => setWantedUrl({ href })}
              wantedUrlHrefIsValid={wantedUrlHrefIsValid}
            />
          )}
        </InjectIntl>

        {/*
          TODO show status code
          isSuccess={(currentUrl !== null && currentUrl.metadata && typeof currentUrl.metadata.statusCode === "number" && currentUrl.metadata.statusCode < 400)}
        */}

        <InjectIntl>
          {({ intl }) => (
            <ReadOnlyTextField
              label={intl.formatMessage({ id: 'UrlEditor.target-url-title.label' })}
              text={(currentUrl?.metadata && typeof currentUrl.metadata.title === 'string') ? currentUrl.metadata.title : ''}
            />
          )}
        </InjectIntl>

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
              {(currentUrl?.metadata) ? currentUrl.metadata.title : ''}
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
                  value={intl.formatMessage({ id: 'UrlEditor.submit' })}
                />
              )}
            </InjectIntl>
          </Control>
        </Field>
      </Box>
    </form>
  )
}
