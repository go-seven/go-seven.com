import * as React from "react"
import {
  Column,
  Columns,
  Section
} from "trunx"

import UrlCard from "./UrlCard"

import {
  ICollection,
  ICollectionsState,
} from "../reducers/collections"

export interface IUrlCollectionProps {
  collection: ICollection | null
  deletingUrlId: ICollectionsState["deletingUrlId"]
  deleteUrl: (urlId?: string) => () => void
  fetchCollection: () => void
}

export default class UrlCollection extends React.Component<IUrlCollectionProps> {
  componentDidMount() {
    this.props.fetchCollection()
  }

  render() {
    const {
      collection,
      deleteUrl,
      deletingUrlId,
    } = this.props

    if (collection === null) {
      return null
    }

    const {
      urls,
    } = collection

    return (
      <Section>
        <Columns isMultiline>
          {urls.map((url, i) => (
            <Column key={i} isOneQuarter>
              <UrlCard
                deleteUrl={deleteUrl(url.id)}
                deletingUrl={deletingUrlId === url.id}
                url={url}
              />
            </Column>
          ))}
        </Columns>
      </Section>
    )
  }
}
