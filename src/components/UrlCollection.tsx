import * as React from "react"
import {
  Column,
  Columns,
  Section
} from "trunx"

import UrlCard from "./UrlCard"

import {
  IUrlCollection,
  IUrlCollectionsState,
} from "../reducers/urlCollections"

export interface IUrlCollectionProps {
  fetchUrlCollection: () => void
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
      </Section>
    )
  }
}
