import * as chartBar from "fa-svg-icon/solid/chart-bar"
import * as plusCircle from "fa-svg-icon/solid/plus-circle"
import * as userCog from "fa-svg-icon/solid/user-cog"
import * as pdsp from "pdsp"
import * as React from "react"
import { FormattedMessage } from "react-intl"
import { Redirect } from "react-router-dom"
import {
  Button,
  Buttons,
  Icon,
  Navbar,
} from "trunx"

import LogoButton from "./LogoButton"

import CreateAccountPage from "../pages/CreateAccountPage"
import CreateUrlPage from "../pages/CreateUrlPage"
import EnterPage from "../pages/EnterPage"
import HomePage from "../pages/HomePage"
import MyUrlsPage from "../pages/MyUrlsPage"
import SettingsPage from "../pages/SettingsPage"

interface IProps {
  authenticationIsValid?: boolean
  exit?: () => void
  locationPath: string
  noMenu?: boolean
  showCreateAccountButton?: boolean
}

interface IState {
  expanded: boolean
  redirect?: string
}

export default class Nav extends React.Component<IProps, IState> {
  state: IState = {
    expanded: false
  }

  onClickBurger = () => {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  onClickCreateAccount = () => {
    this.setState({
      redirect: CreateAccountPage.path
    })
  }

  onClickCreateUrl = () => {
    this.setState({
      redirect: CreateUrlPage.path
    })
  }

  onClickEnter = () => {
    this.setState({
      redirect: EnterPage.path
    })
  }

  onClickExit = (event) => {
    pdsp(event)

    const { exit } = this.props

    if (typeof exit === "function") {
      this.setState({
        expanded: false,
        redirect: HomePage.path,
      }, exit)
    }
  }

  onClickMyUrls = () => {
    if (this.props.locationPath === MyUrlsPage.path) {
      this.setState({ expanded: false })
    } else {
      this.setState({ redirect: MyUrlsPage.path })
    }
  }

  onClickSettings = () => {
    if (this.props.locationPath === SettingsPage.path) {
      this.setState({ expanded: false })
    } else {
      this.setState({ redirect: SettingsPage.path })
    }
  }

  render() {
    const {
      authenticationIsValid,
      locationPath,
      noMenu,
      showCreateAccountButton,
    } = this.props

    const {
      expanded,
      redirect,
    } = this.state

    if (redirect) {
      return (
        <Redirect push to={redirect} />
      )
    }

    return (
      <Navbar
        aria-label="main navigation"
        isFixedTop
        isPrimary
        role="navigation"
      >
        <Navbar.Brand>
          <Navbar.Item>
            <LogoButton />
          </Navbar.Item>

          {noMenu || (
            <Navbar.Burger
              isActive={expanded}
              onClick={this.onClickBurger}
            />
          )}
        </Navbar.Brand>

        {noMenu || (
          <Navbar.Menu isActive={expanded}>
            {authenticationIsValid && (
              <Navbar.Start>
                <Navbar.Item
                  isActive={locationPath === MyUrlsPage.path}
                  onClick={this.onClickMyUrls}
                >
                  <Icon>
                    <Icon.Svg icon={chartBar} />
                  </Icon>

                  &nbsp;

                  <FormattedMessage id="MyUrlsPage.title" />
                </Navbar.Item>

                <Navbar.Item
                  isActive={locationPath === CreateUrlPage.path}
                  onClick={this.onClickCreateUrl}
                >
                  <Icon>
                    <Icon.Svg icon={plusCircle} />
                  </Icon>

                  &nbsp;

                  <FormattedMessage id="CreateUrlPage.title" />
                </Navbar.Item>

                <Navbar.Item
                  isActive={locationPath === SettingsPage.path}
                  onClick={this.onClickSettings}
                >
                  <Icon>
                    <Icon.Svg icon={userCog} />
                  </Icon>

                  &nbsp;

                  <FormattedMessage id="SettingsPage.title" />
                </Navbar.Item>
              </Navbar.Start>
            )}

            <Navbar.End>
              <Navbar.Item>
                {authenticationIsValid ? (
                  <Buttons>
                    <Button
                      onClick={this.onClickExit}
                    >
                     <FormattedMessage id="Navbar.exit" />
                    </Button>
                  </Buttons>
                ) : (
                  <Buttons>
                    <Button
                      onClick={this.onClickEnter}
                    >
                     <FormattedMessage id="Navbar.enter" />
                    </Button>

                    {showCreateAccountButton && (
                      <Button
                        onClick={this.onClickCreateAccount}
                      >
                        <FormattedMessage id="Navbar.create-account" />
                      </Button>
                    )}
                  </Buttons>
                )}
              </Navbar.Item>
            </Navbar.End>
          </Navbar.Menu>
        )}
      </Navbar>
    )
  }
}
