import * as React from "react"
import { useEffect, useState } from "react"
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
  IUrlMonthlyHits,
} from "../reducers/analytics"
import {
  IUrlCollection,
} from "../reducers/urlCollections"

export interface IUrlCollectionProps {
  fetchUrlCollection: () => void
  fetchUrlDailyHits: (urlId: string, day: string) => void
  fetchUrlMonthlyHits: (urlId: string, month: string) => void
  removeUrl: (urlId: string) => () => void
  removingUrlId: string
  urlCollection: IUrlCollection | null
  urlsDailyHits: IUrlDailyHits[]
  urlsMonthlyHits: IUrlMonthlyHits[]
}

export default function UrlCollection({
  fetchUrlCollection,
  fetchUrlDailyHits,
  fetchUrlMonthlyHits,
  removeUrl,
  removingUrlId,
  urlCollection,
  urlsDailyHits,
  urlsMonthlyHits,
}: IUrlCollectionProps) {
  const [redirect, setRedirect] = useState()
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    fetchUrlCollection()
  }, [])

  useEffect(() => {
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
            <Column key={i} isOneThird>
              {typeof url.id === "string" && (
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
                      ({ day: a, }, { day: b }) => (a > b ? 1 : a < b ? -1 : 0)
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
