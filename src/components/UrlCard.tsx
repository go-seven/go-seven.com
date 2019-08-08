import { max as d3Max } from "d3-array"
import { scaleLinear as d3ScaleLinear } from "d3-scale"
import { select as d3Select } from "d3-selection"
import * as solidIcon from "fa-svg-icon/solid"
import * as React from "react"
import * as ReactDOM from "react-dom"
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
  IUrlDailyHits,
  IUrlTotalHits,
} from "../reducers/analytics"
import {
  IUrl
} from "../reducers/urlCollections"

interface IChartProps {
  barColor?: string
  barGap?: number
  urlDailyHits: IUrlDailyHits[]
  height?: number
  windowWidth: number // used as trigger for resize
}

export interface IUrlCardProps {
  fetchUrlDailyHits: (urlId: string, day: string) => void
  fetchUrlTotalHits: (urlId: string) => void
  removeUrl: () => void
  removingUrl: boolean
  url: IUrl
  urlCollectionId: string
  urlDailyHits: IUrlDailyHits[]
  urlTotalHits?: IUrlTotalHits
  windowWidth: number
}

interface IState {
  highlighted: boolean
  redirect?: string
}

const numDays = 7

function Chart({
  barGap = 5,
  barColor = "skyblue",
  urlDailyHits,
  height = 50,
  windowWidth,
}: IChartProps) {
  const numBars = urlDailyHits.length

  const containerRef = React.useRef<HTMLDivElement>(null)
  const barsRef = React.useRef<SVGGElement>(null)

  const [width, setWidth] = React.useState(0)

  React.useEffect(() => {
    const { width } = (ReactDOM.findDOMNode(containerRef.current) as HTMLDivElement).getBoundingClientRect()

    setWidth(width)
  }, [containerRef.current, windowWidth])

  React.useEffect(() => {
    const barWidth = numBars > 0 ? ((width - barGap * (numBars - 1))/ numBars) : 0
    const zeroDataHeight = 1

    const selectY = ({ num }) => num

    const bars = d3Select(ReactDOM.findDOMNode(barsRef.current))

    const y = d3ScaleLinear().domain([0, d3Max(urlDailyHits, selectY)]).range([0, height])

    bars.selectAll("rect").remove()

    bars.selectAll("rect")
      .data(urlDailyHits)
      .enter()
      .append("rect")
      .attr("x", (_d, i) => i * (barWidth + barGap))
      .attr("y", (d) => selectY(d) === 0 ? height - zeroDataHeight : height - zeroDataHeight - y(selectY(d)))
      .attr("width", barWidth)
      .attr("height", (d) => selectY(d) === 0 ? zeroDataHeight : zeroDataHeight + y(selectY(d)))
      .attr("fill", barColor)
  }, [barColor, height, urlDailyHits, width])

  return (
    <div
      ref={containerRef}
      className="url-card__chart"
    >
      <svg
        height={height}
        width={width}
      >
        <g ref={barsRef} />
      </svg>
    </div>
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

    fetchUrlTotalHits(id)

    for (let i = 1; i <= numDays; i++) {
      time.setDate(time.getDate() - 1)

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
      urlDailyHits,
      urlTotalHits,
      windowWidth,
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

          <Chart
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
