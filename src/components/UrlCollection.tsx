import * as React from "react"
import {
  Column,
  Columns,
  Section
} from "trunx"

import UrlCard from "./UrlCard"

import {
  ICollection,
} from "../reducers/collections"

export interface IUrlCollectionProps {
  fetchCollection: () => void
  collection: ICollection | null
}

export default class UrlCollection extends React.Component<IUrlCollectionProps> {
  componentDidMount() {
    this.props.fetchCollection()
  }

  render() {
    const {
      collection,
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
                url={url}
              />
            </Column>
          ))}
        </Columns>
      </Section>
    )
  }
}
