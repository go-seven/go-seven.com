import * as chartBar from 'fa-svg-icon/solid/chart-bar'
import * as plusCircle from 'fa-svg-icon/solid/plus-circle'
import * as userCog from 'fa-svg-icon/solid/user-cog'
import * as pdsp from 'pdsp'
import * as React from 'react'
import { FormattedMessage } from 'react-intl'
import { useSpring, animated } from 'react-spring'
import { Redirect } from 'react-router-dom'
import {
  Button,
  Buttons,
  Icon,
  Navbar
} from 'trunx'

import LogoButton from './LogoButton'

import CreateAccountPage from '../pages/CreateAccountPage'
import CreateUrlPage from '../pages/CreateUrlPage'
import EnterPage from '../pages/EnterPage'
import HomePage from '../pages/HomePage'
import MyUrlsPage from '../pages/MyUrlsPage'
import SettingsPage from '../pages/SettingsPage'

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
  session: string
  storedSession: string | null
}

function ItemIcon ({ animate, icon }) {
  return (
    <>
      <Icon>
        <animated.div
          className="navbar__item-icon"
          style={useSpring({
            opacity: 1,
            config: { duration: 1000 },
            from: { opacity: animate ? 0 : 1 },
            delay: 500
          })}
        >
          <Icon.Svg icon={icon} />
        </animated.div>
      </Icon>

      &nbsp;
    </>
  )
}

const session = new Date().getTime().toString()

export default class Nav extends React.Component<IProps, IState> {
  state: IState = {
    expanded: false,
    session,
    storedSession: sessionStorage.getItem('session')
  }

  componentDidMount () {
    const {
      authenticationIsValid
    } = this.props

    const {
      storedSession,
      session
    } = this.state

    if (authenticationIsValid && storedSession === null) {
      sessionStorage.setItem('session', session)
    }
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

    if (typeof exit === 'function') {
      this.setState({
        expanded: false,
        redirect: HomePage.path
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

  render () {
    const {
      authenticationIsValid,
      locationPath,
      noMenu,
      showCreateAccountButton
    } = this.props

    const {
      expanded,
      redirect,
      storedSession
    } = this.state

    if (redirect) {
      return (
        <Redirect push to={redirect} />
      )
    }

    const isFirstRendering = storedSession === null

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
                  <ItemIcon animate={isFirstRendering} icon={chartBar} />

                  <FormattedMessage id="MyUrlsPage.title" />
                </Navbar.Item>

                <Navbar.Item
                  isActive={locationPath === CreateUrlPage.path}
                  onClick={this.onClickCreateUrl}
                >
                  <ItemIcon animate={isFirstRendering} icon={plusCircle} />

                  <FormattedMessage id="CreateUrlPage.title" />
                </Navbar.Item>

                <Navbar.Item
                  isActive={locationPath === SettingsPage.path}
                  onClick={this.onClickSettings}
                >
                  <ItemIcon animate={isFirstRendering} icon={userCog} />

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
