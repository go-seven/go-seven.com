import * as React from "react"
import { FormattedMessage } from "react-intl"
import { Redirect } from "react-router-dom"
import {
  Button,
  Column,
  Columns,
  Notification,
  Section
} from "trunx"

import UrlCard from "./UrlCard"

import CreateUrlPage from "../pages/CreateUrlPage"

import {
  IUrlDailyHits,
  IUrlTotalHits,
} from "../reducers/analytics"
import {
  IUrlCollection,
} from "../reducers/urlCollections"

export interface IUrlCollectionProps {
  fetchUrlCollection: () => void
  fetchUrlDailyHits: (urlId: string, day: string) => void
  fetchUrlTotalHits: (urlId: string) => void
  removeUrl: (urlId: string) => () => void
  removingUrlId: string
  urlCollection: IUrlCollection | null
  urlsDailyHits: IUrlDailyHits[]
  urlsTotalHits: IUrlTotalHits[]
}

export default function UrlCollection({
  fetchUrlCollection,
  fetchUrlDailyHits,
  fetchUrlTotalHits,
  removeUrl,
  removingUrlId,
  urlCollection,
  urlsDailyHits,
  urlsTotalHits,
}: IUrlCollectionProps) {
  const [redirect, setRedirect] = React.useState()
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

  const onClickCreateUrl = () => {
    setRedirect(CreateUrlPage.path)
  }

  if (urlCollection === null) {
    return null
  }

  if (redirect) {
    return (
      <Redirect push to={redirect} />
    )
  }

  const {
    urls,
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
              onClick={onClickCreateUrl}
            >
              <FormattedMessage id="UrlCollection.is-empty.action" />
            </Button>
          </Column>
        </Columns>
      ) : (
        <Columns isMultiline>
          {urls.map((url, i) => (
            <Column key={i} isOneQuarter>
              {typeof url.id === "string" && (
                <UrlCard
                  fetchUrlDailyHits={fetchUrlDailyHits}
                  fetchUrlTotalHits={fetchUrlTotalHits}
                  removeUrl={removeUrl(url.id)}
                  removingUrl={removingUrlId === url.id}
                  url={url}
                  urlCollectionId={urlCollection.id}
                  urlDailyHits={
                    urlsDailyHits.filter(
                      ({ id }) => id === url.id
                    ).sort(
                      ({ day: a, }, { day: b }) => (a > b ? 1 : a < b ? -1 : 0)
                    )
                  }
                  urlTotalHits={urlsTotalHits.find(({ id }) => id === url.id)}
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
