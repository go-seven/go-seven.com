import * as solidIcon from 'fa-svg-icon/solid'
import * as React from 'react'
import { FormattedMessage } from 'react-intl'
import { Redirect } from 'react-router-dom'
import {
  Card,
  Control,
  Field,
  Icon,
  Tag,
  Tags
} from 'trunx'

import UrlPage from '../pages/UrlPage'

import {
  IUrlDailyHits,
  IUrlMonthlyHits
} from '../reducers/analytics'
import {
  IUrl
} from '../reducers/urlCollections'

import UrlCardHistogram from './UrlCardHistogram'

export interface IUrlCardProps {
  fetchUrlDailyHits: (urlId: string, day: string) => void
  fetchUrlMonthlyHits: (urlId: string, month: string) => void
  removeUrl: () => void
  removingUrl: boolean
  url: IUrl
  urlCollectionId: string
  urlDailyHits: IUrlDailyHits[]
  urlMonthlyHits?: IUrlMonthlyHits
  windowWidth: number
}

interface IState {
  highlighted: boolean
  redirect?: string
}

const numDays = 7

export default class UrlCard extends React.Component<IUrlCardProps, IState> {
  state: IState = {
    highlighted: false
  }

  componentDidMount () {
    const {
      fetchUrlDailyHits,
      fetchUrlMonthlyHits,
      url: { id }
    } = this.props

    let time = new Date()

    const month = time.toISOString().slice(0, 7)
    fetchUrlMonthlyHits(id, month)

    const oneDayBefore = (t1) => {
      const t2 = new Date(t1)

      t2.setDate(t2.getDate() - 1)

      return t2
    }

    for (let i = 0; i < numDays; i++) {
      const day = time.toISOString().slice(0, 10)

      fetchUrlDailyHits(id, day)

      time = oneDayBefore(time)
    }
  }

  onClickEdit = () => {
    const {
      url,
      urlCollectionId
    } = this.props

    this.setState({
      redirect: UrlPage.buildPath({ urlCollectionId, urlId: url.id })
    })
  }

  onClickCard = () => {
    this.setState({
      highlighted: true
    })
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

  render () {
    const {
      removingUrl,
      url,
      urlDailyHits,
      urlMonthlyHits,
      windowWidth
    } = this.props

    const {
      highlighted,
      redirect
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
                  onClick={(event) => { event.stopPropagation() }}
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
                  <FormattedMessage id="UrlCard.month-to-date" />
                </Tag>

                <Tag>
                  {urlMonthlyHits && urlMonthlyHits.num}
                </Tag>
              </Tags>
            </Control>
          </Field>

          <UrlCardHistogram
            urlDailyHits={urlDailyHits.length === numDays ? urlDailyHits : []}
            windowWidth={windowWidth}
          />

          <span>
            {url.title}
          </span>
        </Card.Content>
      </Card>
    )
  }
}
