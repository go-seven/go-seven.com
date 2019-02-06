import * as React from "react"
import { Redirect } from "react-router-dom"
import {
  Image,
} from "trunx"

import Homepage from "../pages/Homepage"

interface IProps {}

interface IState {
  redirect?: string
}

export default class Logo extends React.Component<IProps, IState> {
  state: IState = {
  }

  onClickLogo = (event) => {
    this.setState({
      redirect: Homepage.path
    })
  }

  render() {
    const {
      redirect,
    } = this.state

    if (redirect) {
      return (
        <Redirect push to={redirect} />
      )
    }

    return (
      <Image
        alt="GoSeven Logo"
        height="28"
        onClick={this.onClickLogo}
        src="media/logo.svg"
        width="28"
      />
    )
  }
}
