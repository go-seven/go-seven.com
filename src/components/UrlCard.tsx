import * as solidIcon from "fa-svg-icon/solid"
import * as React from "react"
import { Redirect } from "react-router-dom"
import {
  Card,
  Icon,
  Tag,
} from "trunx"

import UrlPage from "../pages/UrlPage"

import {
  IUrl
} from "../reducers/urlCollections"

export interface IUrlCardProps {
  removeUrl: () => void
  removingUrl: boolean
  url: IUrl
  urlCollectionId: string
}

interface IState {
  highlighted: boolean
  redirect?: string
}

export default class UrlCard extends React.Component<IUrlCardProps, IState> {
  state: IState = {
    highlighted: false,
  }

  onClickEdit = () => {
    const {
      url,
      urlCollectionId,
    } = this.props

    this.setState({
      redirect: UrlPage.buildPath({ urlCollectionId, urlId: url.id })
    })
  }

  onClickCard = () => {
    this.setState({
      highlighted: true,
    })
  }

  onClickLink = (event) => {
    event.stopPropagation()
  }

  onMouseEnterCard = () => {
    this.setState({
      highlighted: true
    })
  }

  onMouseLeaveCard = () => {
    this.setState({
      highlighted: false
    })
  }

  render() {
    const {
      removingUrl,
      url,
    } = this.props

    const {
      highlighted,
      redirect,
    } = this.state

    if (redirect) {
      return (
        <Redirect push to={redirect} />
      )
    }

    return (
      <Card
        onClick={this.onClickCard}
        onMouseEnter={this.onMouseEnterCard}
        onMouseLeave={this.onMouseLeaveCard}
      >
        <Card.Header>
          <Card.Header.Title>
            <Tag
              href={url.href}
              isLink={!removingUrl && highlighted}
              isWarning={removingUrl}
              onClick={this.onClickLink}
              target="_blank"
            >
              {url.id}
            </Tag>
          </Card.Header.Title>

          <Card.Header.Icon>
            {removingUrl ? (null) : (
              highlighted && (
                <Icon onClick={this.onClickEdit}>
                  <Icon.Svg
                    icon={solidIcon.edit}
                  />
                </Icon>
              )
            )}
          </Card.Header.Icon>
        </Card.Header>

        <Card.Content>
          <span>
            {url.title}
          </span>
        </Card.Content>
      </Card>
    )
  }
}
