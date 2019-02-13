import * as React from "react"
import { Link, Redirect } from "react-router-dom"
import {
  Button,
  Control,
  Field,
  Image,
  Navbar,
} from "trunx"

import Logo from "./Logo"

import CreateAccount from "../pages/CreateAccount"
import Enter from "../pages/Enter"
import Homepage from "../pages/Homepage"

interface IProps {
  authenticationIsValid?: boolean
  exit: () => void
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
      redirect: CreateAccount.path
    })
  }

  onClickEnter = (event) => {
    this.setState({
      redirect: Enter.path
    })
  }

  onClickExit = (event) => {
    this.setState({
      redirect: Homepage.path
    }, () => {
      this.props.exit()
    })
  }

  render() {
    const {
      authenticationIsValid,
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
                <Navbar.Item>
                  Create
                </Navbar.Item>
              </Navbar.Start>
            )}

            <Navbar.End>
              <Navbar.Item>
                {authenticationIsValid ? (
                  <Field>
                    <Control>
                      <Button
                        onClick={this.onClickExit}
                      >
                        Exit
                      </Button>
                    </Control>
                  </Field>
                ) : (
                  <Field isGrouped>
                    <Control>
                      <Button
                        onClick={this.onClickEnter}
                      >
                        Enter
                      </Button>
                    </Control>

                    <Control>
                      <Button
                        onClick={this.onClickCreateAccount}
                      >
                        Create Account
                      </Button>
                    </Control>
                  </Field>
                )}
              </Navbar.Item>
            </Navbar.End>
          </Navbar.Menu>
        )}
      </Navbar>
    )
  }
}
