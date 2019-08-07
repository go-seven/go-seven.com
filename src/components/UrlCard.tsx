import * as solidIcon from "fa-svg-icon/solid"
import * as React from "react"
import { FormattedMessage } from "react-intl"
import { Redirect } from "react-router-dom"
import {
  Card,
  Control,
  Field,
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
  fetchUrlDailyHits: (urlId: string, day: string) => void
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

function Chart() {
  return (
    <svg>
      <text>ok</text>
    </svg>
  )
}

export default class UrlCard extends React.Component<IUrlCardProps, IState> {
  state: IState = {
    highlighted: false,
  }

  componentDidMount() {
    const {
      fetchUrlDailyHits,
      fetchUrlTotalHits,
      url: { id },
    } = this.props

    const time = new Date()
    const numDays = 7

    fetchUrlTotalHits(id)

    for (let i = 1; i <= numDays; i++) {
      time.setDate(time.getDate() - i)

      const day = time.toISOString().slice(0, 10)

      fetchUrlDailyHits(id, day)
    }
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
            <Tags hasAddons>
              <Tag>
                {url.id}
              </Tag>

              {highlighted && (

              <Tag
                href={url.href}
                isLink={!removingUrl && highlighted}
                isWarning={removingUrl}
                onClick={this.onClickLink}
                target="_blank"
              >
                <Icon>
                  <Icon.Svg
                    icon={solidIcon.externalLinkSquareAlt}
                  />
                </Icon>
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
          <Field isGrouped>
            <Control>
              <Tags hasAddons>
                <Tag>
                  <FormattedMessage id="UrlCard.total" />
                </Tag>

                <Tag>
                  {urlTotalHits && urlTotalHits.tot}
                </Tag>
              </Tags>
            </Control>
          </Field>

          <div className="url-card__chart">
            <Chart />
          </div>

          <span>
            {url.title}
          </span>
        </Card.Content>
      </Card>
    )
  }
}
