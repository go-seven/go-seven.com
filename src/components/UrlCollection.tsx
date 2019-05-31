import * as React from "react"
import {
  Column,
  Columns,
  Section
} from "trunx"

import UrlCard, { IUrlCardProps } from "./UrlCard"

import {
  ICollection,
  ICollectionsState,
} from "../reducers/collections"

export interface IUrlCollectionProps {
  collection: ICollection | null
  deleteUrl: IUrlCardProps["deleteUrl"]
  deletingUrlId: ICollectionsState["deletingUrlId"]
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
                deleteUrl={deleteUrl}
                url={url}
              />
            </Column>
          ))}
        </Columns>
      </Section>
    )
  }
}
