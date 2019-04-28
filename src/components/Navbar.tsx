import * as React from "react"
import { Link, Redirect } from "react-router-dom"
import {
  Button,
  Buttons,
  Control,
  Field,
  Image,
  Navbar,
} from "trunx"

import Logo from "./Logo"

import CreateAccountPage from "../pages/CreateAccountPage"
import EnterPage from "../pages/EnterPage"
import HomePage from "../pages/HomePage"
import SettingsPage from "../pages/SettingsPage"
import UrlCollectionPage from "../pages/UrlCollectionPage"

interface IProps {
  authenticationIsValid?: boolean
  exit: () => void
  locationPath?: string
  noMenu?: boolean
}

interface IState {
  expanded: boolean
  redirect?: string
}

export default class Nav extends React.Component<IProps, IState> {
  static defaultProps = {
    exit: Function.prototype
  }

  state: IState = {
    expanded: false
  }

  onClickBurger = (event) => {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  onClickCreateAccount = (event) => {
    this.setState({
      redirect: CreateAccountPage.path
    })
  }

  onClickEnter = (event) => {
    this.setState({
      redirect: EnterPage.path
    })
  }

  onClickExit = (event) => {
    this.setState({
      redirect: HomePage.path
    }, () => {
      this.props.exit()
    })
  }

  onClickSettings = (event) => {
    if (this.props.locationPath !== SettingsPage.path) {
      this.setState({
        redirect: SettingsPage.path
      })
    }
  }

  onClickUrlCollection = (event) => {
    if (this.props.locationPath !== UrlCollectionPage.path) {
      this.setState({
        redirect: UrlCollectionPage.path
      })
    }
  }

  render() {
    const {
      authenticationIsValid,
      locationPath,
      noMenu,
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
            <Logo />
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
                  isActive={locationPath === UrlCollectionPage.path}
                  onClick={this.onClickUrlCollection}
                >
                  URL Collection
                </Navbar.Item>

                <Navbar.Item
                  isActive={locationPath === SettingsPage.path}
                  onClick={this.onClickSettings}
                >
                  Settings
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
                      Exit
                    </Button>
                  </Buttons>
                ) : (
                  <Buttons>
                    <Button
                      onClick={this.onClickEnter}
                    >
                      Enter
                    </Button>

                    <Button
                      onClick={this.onClickCreateAccount}
                    >
                      Create Account
                    </Button>
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
