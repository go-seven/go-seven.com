import * as React from "react"
import { Redirect } from "react-router-dom"
import {
  Image,
} from "trunx"

import HomePage from "../pages/HomePage"

interface IProps {}

interface IState {
  redirect?: string
}

export default class LogoButton extends React.Component<IProps, IState> {
  state: IState = {
  }

  onClickLogo = () => {
    this.setState({
      redirect: HomePage.path
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
      <div className="logo-button">
        <Image
          alt=""
          height="34"
          onClick={this.onClickLogo}
          src="/media/logo.svg"
          width="34"
        />
      </div>
    )
  }
}
