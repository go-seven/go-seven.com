import * as pdsp from 'pdsp'
import * as React from 'react'
import { FormattedMessage } from 'react-intl'
import InjectIntl from 'react-intl-inject'
import {
  Box,
  Button,
  Column,
  Columns,
  Control,
  Field,
  Input,
  Label
} from 'trunx'

import ReadOnlyTextField from './ReadOnlyTextField'
import ShortUrlIdField from './ShortUrlIdField'
import TargetUrlHrefField from './TargetUrlHrefField'

import {
  IUrl
} from '../reducers/urlCollections'

export interface IUrlCreatorProps {
  createUrl: (IUrl) => void
  domain: string
  checkingIfUrlIdExists: boolean
  creatingUrl: boolean
  fetchingUrlMetadata: boolean
  justCreatedUrls: IUrl[]
  setWantedUrl: (IUrl) => void
  wantedUrl: IUrl | null
  wantedUrlHrefIsValid: boolean
  wantedUrlIdExists: boolean
}

export default function UrlCreator ({
  checkingIfUrlIdExists,
  createUrl,
  creatingUrl,
  domain,
  fetchingUrlMetadata,
  justCreatedUrls,
  setWantedUrl,
  wantedUrl,
  wantedUrlIdExists,
  wantedUrlHrefIsValid
}: IUrlCreatorProps) {
  const numJustCreatedUrls = justCreatedUrls.length

  const generateId = () => (
    new Date().getTime().toString(36)
  )

  const [wantedUrlId, setWantedUrlId] = React.useState(generateId())
  const [wantedTitle, setWantedTitle] = React.useState('')

  React.useEffect(() => {
    if (wantedTitle === '' && wantedUrl !== null && typeof wantedUrl.title === 'string') {
      setWantedTitle(wantedUrl.title)
    }
  }, [wantedUrl])

  const onChangeTitle = (event) => {
    pdsp(event)

    setWantedTitle(event.target)
  }

  const onSubmit = (event) => {
    pdsp(event)

    if (wantedUrl !== null) {
      const { href } = wantedUrl
      const title = wantedTitle.trim()

      createUrl({
        href,
        id: wantedUrlId,
        title
      })
    }
  }

  const saveButtonDisabled = (
    (wantedUrlIdExists === true) ||
    (wantedUrlHrefIsValid !== true) ||
    fetchingUrlMetadata ||
    checkingIfUrlIdExists
  )

  return (
    <form
      onSubmit={onSubmit}
    >
      <Box>
        <InjectIntl>
          {({ intl }) => (
            <TargetUrlHrefField
              isLoading={fetchingUrlMetadata}
              label={intl.formatMessage({ id: 'UrlCreator.target-url.label' })}
              placeholder={intl.formatMessage({ id: 'UrlCreator.target-url.placeholder' })}
              readOnly={creatingUrl}
              resetTargetUrlHref={numJustCreatedUrls}
              setTargetUrlHref={(href) => setWantedUrl({ href })}
              wantedUrlHrefIsValid={wantedUrlHrefIsValid}
            />
          )}
        </InjectIntl>

        <InjectIntl>
          {({ intl }) => (
            <ReadOnlyTextField
              label={intl.formatMessage({ id: 'UrlCreator.target-url-title.label' })}
              text={(wantedUrl && wantedUrl.title) ? wantedUrl.title : ''}
            />
          )}
        </InjectIntl>

        <Field>
          <Label>
            <FormattedMessage id="UrlCreator.short-url-title.label" />
          </Label>

          <Control>
            <Input
              onChange={onChangeTitle}
              type="text"
              value={wantedTitle}
            />
          </Control>
        </Field>

        <Columns isDesktop>
          <Column isHalf>
            <InjectIntl>
              {({ intl }) => (
                <ShortUrlIdField
                  domain={domain}
                  isLoading={checkingIfUrlIdExists}
                  label={intl.formatMessage({ id: 'UrlCreator.short-url.label' })}
                  readOnly={creatingUrl}
                  resetUrlId={numJustCreatedUrls}
                  setWantedUrlId={setWantedUrlId}
                  wantedUrlId={wantedUrlId}
                  wantedUrlIdExists={wantedUrlIdExists}
                />
              )}
            </InjectIntl>
          </Column>
        </Columns>

        <Field>
          <Control>
            <InjectIntl>
              {({ intl }) => (
                <Button
                  disabled={saveButtonDisabled}
                  isLoading={creatingUrl}
                  isSuccess={wantedUrlHrefIsValid === true}
                  type="submit"
                  value={intl.formatMessage({ id: 'UrlCreator.submit' })}
                />
              )}
            </InjectIntl>
          </Control>
        </Field>
      </Box>
    </form>
  )
}
