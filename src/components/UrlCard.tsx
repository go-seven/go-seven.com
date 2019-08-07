import * as solidIcon from "fa-svg-icon/solid"
import * as React from "react"
import { Redirect } from "react-router-dom"
import {
  Card,
  Icon,
  Tag,
  Tags,
} from "trunx"

import UrlPage from "../pages/UrlPage"

import {
  IUrlTotalHits,
} from "../reducers/analytics"
import {
  IUrl
} from "../reducers/urlCollections"

export interface IUrlCardProps {
  fetchUrlTotalHits: (urlId: string) => void
  removeUrl: () => void
  removingUrl: boolean
  url: IUrl
  urlCollectionId: string
  urlTotalHits?: IUrlTotalHits
}

interface IState {
  highlighted: boolean
  redirect?: string
}

export default class UrlCard extends React.Component<IUrlCardProps, IState> {
  state: IState = {
    highlighted: false,
  }

  componentDidMount() {
    const {
      fetchUrlTotalHits,
      url: { id },
    } = this.props

    fetchUrlTotalHits(id)
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
      urlTotalHits,
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
            <Tags>
              <Tag
                href={url.href}
                isLink={!removingUrl && highlighted}
                isWarning={removingUrl}
                onClick={this.onClickLink}
                target="_blank"
              >
                {url.id}
              </Tag>

              {urlTotalHits && (
                <Tag>
                  {urlTotalHits.tot}
                </Tag>
              )}
            </Tags>
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
