import * as React from "react"

interface IProps {
  fetchCollection: () => void
}

export default class UrlCollections extends React.Component<IProps> {
  componentDidMount() {
    this.props.fetchCollection()
  }

  render() {
    return null
  }
}
