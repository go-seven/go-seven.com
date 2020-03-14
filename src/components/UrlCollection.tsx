import * as React from 'react'
import { FormattedMessage } from 'react-intl'
import { Redirect } from 'react-router-dom'
import {
  Button,
  Column,
  Columns,
  Notification,
  Section
} from 'trunx'

import {
  IUrlCollection,
  TUrlId,
} from '../model'

import CreateUrlPage from '../pages/CreateUrlPage'

import UrlCard from './UrlCard'

interface IUrlCollectionProps {
  fetchUrlCollection: () => void
  fetchUrlDailyHits: (urlId: string, day: string) => void
  fetchUrlMonthlyHits: (urlId: string, month: string) => void
  removeUrl: (urlId: TUrlId) => () => void
  removingUrlId: TUrlId
  urlCollection: IUrlCollection
  urlsDailyHits: IUrlDailyHits[]
  urlsMonthlyHits: IUrlMonthlyHits[]
}

export default function UrlCollection ({
  fetchUrlCollection,
  fetchUrlDailyHits,
  fetchUrlMonthlyHits,
  removeUrl,
  removingUrlId,
  urlCollection,
  urlsDailyHits,
  urlsMonthlyHits
}: IUrlCollectionProps) {
  const [redirect, setRedirect] = React.useState('')
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth)

  React.useEffect(() => {
    fetchUrlCollection()
  }, [])

  React.useEffect(() => {
    const resizeHandler = () => setWindowWidth(window.innerWidth)

    window.addEventListener('resize', resizeHandler)

    return () => {
      window.removeEventListener('resize', resizeHandler)
    }
  }, [])

  if (redirect) {
    return (
      <Redirect push to={redirect} />
    )
  }

  const {
    urls
  } = urlCollection

  return (
    <Section>
      {urls.length === 0 ? (
        <Columns>
          <Column>
            <Notification>
              <FormattedMessage id="UrlCollection.is-empty.message" />.
            </Notification>

            <Button
              isPrimary
              onClick={() => setRedirect(CreateUrlPage.path)}
            >
              <FormattedMessage id="UrlCollection.is-empty.action" />
            </Button>
          </Column>
        </Columns>
      ) : (
        <Columns isMultiline>
          {urls.map((url, i) => (
            <Column key={i} isOneThird>
              {typeof url.id === 'string' && (
                <UrlCard
                  fetchUrlDailyHits={fetchUrlDailyHits}
                  fetchUrlMonthlyHits={fetchUrlMonthlyHits}
                  removeUrl={removeUrl(url.id)}
                  removingUrl={removingUrlId === url.id}
                  url={url}
                  urlCollectionId={urlCollection.id}
                  urlDailyHits={
                    urlsDailyHits.filter(
                      ({ id }) => id === url.id
                    ).sort(
                      ({ day: a }, { day: b }) => (a > b ? 1 : a < b ? -1 : 0)
                    )
                  }
                  urlMonthlyHits={urlsMonthlyHits.find(({ id }) => id === url.id)}
                  windowWidth={windowWidth}
                />
              )}
            </Column>
          ))}
        </Columns>
      )}
    </Section>
  )
}
