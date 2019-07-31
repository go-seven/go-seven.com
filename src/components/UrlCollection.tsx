import * as React from "react"
import { Redirect } from "react-router-dom"
import {
  Column,
  Columns,
  Progress,
  Section
} from "trunx"

import UrlCard from "./UrlCard"

import CreateUrlPage from "../pages/CreateUrlPage"

import {
  IUrlCollection,
  IUrlCollectionsState,
} from "../reducers/urlCollections"

export interface IUrlCollectionProps {
  fetchUrlCollection: () => void
  isFetchingUrlCollection: boolean
  removeUrl: (urlId: string) => () => void
  removingUrlId: IUrlCollectionsState["removingUrlId"]
  urlCollection: IUrlCollection | null
}

export default class UrlCollection extends React.Component<IUrlCollectionProps> {
  componentDidMount() {
    this.props.fetchUrlCollection()
  }

  render() {
    const {
      isFetchingUrlCollection,
      removeUrl,
      removingUrlId,
      urlCollection,
    } = this.props

    if (urlCollection === null) {
      return null
    }

    const {
      urls,
    } = urlCollection

    return (
      <Section>
        {isFetchingUrlCollection ? (
          <Progress isPrimary />
        ) : (
          <>
            {urls.length === 0 ? (
              <Redirect push to={CreateUrlPage.path} />
            ) : (
              <Columns isMultiline>
                {urls.map((url, i) => (
                  <Column key={i} isOneQuarter>
                    {typeof url.id === "string" && (
                      <UrlCard
                        removeUrl={removeUrl(url.id)}
                        removingUrl={removingUrlId === url.id}
                        url={url}
                      />
                    )}
                  </Column>
                ))}
              </Columns>
            )}
          </>
        )}
      </Section>
    )
  }
}
