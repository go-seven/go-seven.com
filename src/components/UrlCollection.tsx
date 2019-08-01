import * as React from "react"
import { FormattedMessage } from "react-intl"
import { Redirect } from "react-router-dom"
import {
  Button,
  Column,
  Columns,
  Notification,
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

interface IState {
  redirect?: string
}

export default class UrlCollection extends React.Component<IUrlCollectionProps> {
  state: IState = {}

  componentDidMount() {
    this.props.fetchUrlCollection()
  }

  onClickCreateUrl = () => {
    this.setState({
      redirect: CreateUrlPage.path
    })
  }

  render() {
    const {
      isFetchingUrlCollection,
      removeUrl,
      removingUrlId,
      urlCollection,
    } = this.props

    const {
      redirect,
    } = this.state

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
        {isFetchingUrlCollection ? (
          <Progress isPrimary />
        ) : (
          <>
            {urls.length === 0 ? (
              <Columns>
                <Column>
                  <Notification>
                    <FormattedMessage id="UrlCollection.is-empty.message" />.
                  </Notification>

                  <Button
                    isPrimary
                    onClick={this.onClickCreateUrl}
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
