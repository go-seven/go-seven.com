import * as solidIcon from 'fa-svg-icon/solid'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Redirect } from 'react-router-dom'
import {
  Card,
  Control,
  Field,
  Icon,
  Tag,
  Tags
} from 'trunx'

import pagePath from '../pages/paths'

import UrlCardHistogram from './UrlCardHistogram'

export default function UrlCard ({
  removingUrl = false,
  fetchUrlDailyHits,
  fetchUrlMonthlyHits,
  numDays = 7,
  url,
  urlCollectionId,
  urlDailyHits,
  urlMonthlyHits,
  windowWidth
}) {
  const [highlighted, setHighlighted] = useState(false)
  const [redirect, setRedirect] = useState('')

  useEffect(() => {
    let time = new Date()

    const month = time.toISOString().slice(0, 7)
    fetchUrlMonthlyHits(url.id, month)

    const oneDayBefore = (t1) => {
      const t2 = new Date(t1)

      t2.setDate(t2.getDate() - 1)

      return t2
    }

    for (let i = 0; i < numDays; i++) {
      const day = time.toISOString().slice(0, 10)

      fetchUrlDailyHits(url.id, day)

      time = oneDayBefore(time)
    }
  }, [fetchUrlDailyHits, fetchUrlMonthlyHits])

  if (redirect) {
    return (
      <Redirect push to={redirect} />
    )
  }

  return (
    <Card
      onClick={() => setHighlighted(true)}
      onMouseEnter={() => setHighlighted(true)}
      onMouseLeave={() => setHighlighted(false)}
    >
      <Card.Header>
        <Card.Header.Title>
          <Tags hasAddons>
            <Tag>
              {url.id}
            </Tag>

            {highlighted && (

              <Tag
                href={url.href}
                isLink={!removingUrl && highlighted}
                isWarning={removingUrl}
                onClick={(event) => { event.stopPropagation() }}
                target="_blank"
              >
                <Icon>
                  <Icon.Svg
                    icon={solidIcon.externalLinkSquareAlt}
                  />
                </Icon>
              </Tag>
            )}
          </Tags>
        </Card.Header.Title>

        <Card.Header.Icon>
          {removingUrl ? (null) : (
            highlighted && (
              <Icon
                onClick={
                  () => setRedirect(pagePath.url({ urlCollectionId, urlId: url.id }))
                }
              >
                <Icon.Svg
                  icon={solidIcon.edit}
                />
              </Icon>
            )
          )}
        </Card.Header.Icon>
      </Card.Header>

      <Card.Content>
        <Field isGrouped>
          <Control>
            <Tags hasAddons>
              <Tag>
                <FormattedMessage id="UrlCard.month-to-date" />
              </Tag>

              <Tag>
                {urlMonthlyHits?.num}
              </Tag>
            </Tags>
          </Control>
        </Field>

        <UrlCardHistogram
          urlDailyHits={urlDailyHits.length === numDays ? urlDailyHits : []}
          windowWidth={windowWidth}
        />

        <span>
          {url.title}
        </span>
      </Card.Content>
    </Card>
  )
}
