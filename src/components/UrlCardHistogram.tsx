import { max as d3Max } from 'd3-array'
import { transition as d3Transition } from 'd3-transition'
import { scaleLinear as d3ScaleLinear } from 'd3-scale'
import { select as d3Select } from 'd3-selection'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

declare type ScaleFunction = (value: number) => number

export default function UrlCardHistogram ({
  barGap = 5,
  barColor = 'skyblue',
  urlDailyHits,
  height = 50,
  windowWidth // used as trigger for resize
}) {
  const numBars = urlDailyHits.length

  const containerRef = React.useRef<HTMLDivElement>(null)
  const barsRef = React.useRef<SVGGElement>(null)

  const [width, setWidth] = React.useState(0)

  React.useEffect(() => {
    const { width } = (ReactDOM.findDOMNode(containerRef.current) as HTMLDivElement).getBoundingClientRect()

    setWidth(width)
  }, [containerRef.current, windowWidth])

  React.useEffect(() => {
    const barWidth = numBars > 0 ? ((width - barGap * (numBars - 1)) / numBars) : 0
    const zeroDataHeight = 1

    const selectY = ({ num }) => num

    const bars = d3Select(ReactDOM.findDOMNode(barsRef.current))

    const y: ScaleFunction = d3ScaleLinear().domain([0, d3Max(urlDailyHits, selectY)]).range([0, height])

    bars.selectAll('rect').remove()

    bars.selectAll('rect')
      .data(urlDailyHits)
      .enter()
      .append('rect')
      .attr('x', (_d, i) => i * (barWidth + barGap))
      .attr('width', barWidth)
      .attr('fill', barColor)
      .attr('height', () => 0)
      .attr('y', () => height - zeroDataHeight)
      .transition(d3Transition().duration(500))
      .attr('height', (d) => selectY(d) === 0 ? zeroDataHeight : zeroDataHeight + y(selectY(d)))
      .attr('y', (d) => selectY(d) === 0 ? height - zeroDataHeight : height - zeroDataHeight - y(selectY(d)))
  }, [barColor, height, urlDailyHits, width])

  return (
    <div
      ref={containerRef}
      className="url-card-histogram"
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
