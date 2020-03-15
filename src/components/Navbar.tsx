import * as chartBar from 'fa-svg-icon/solid/chart-bar'
import * as plusCircle from 'fa-svg-icon/solid/plus-circle'
import * as userCog from 'fa-svg-icon/solid/user-cog'
import pdsp from 'pdsp'
import * as React from 'react'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Redirect, useLocation } from 'react-router-dom'
import {
  Button,
  Buttons,
  Icon,
  Navbar
} from 'trunx'

import route from '../routes'

import LogoButton from './LogoButton'

function ItemIcon ({ icon }) {
  return (
    <>
      <Icon>
        <div className="navbar__item-icon">
          <Icon.Svg icon={icon} />
        </div>
      </Icon>

      &nbsp;
    </>
  )
}

export default function Nav (
  authenticationIsValid,
  exit,
  noMenu,
  showCreateAccountButton
) {
  const { pathname } = useLocation()

  const [expanded, setExpanded] = useState(false)
  const [redirect, setRedirect] = useState('')

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
          <LogoButton
            disabledClick={pathname === route.home}
          />
        </Navbar.Item>

        {noMenu ?? (
          <Navbar.Burger
            isActive={expanded}
            onClick={() => setExpanded(!expanded)}
          />
        )}
      </Navbar.Brand>

      {noMenu ?? (
        <Navbar.Menu isActive={expanded}>
          {authenticationIsValid && (
            <Navbar.Start>
              <Navbar.Item
                isActive={pathname === route.myUrls}
                onClick={() => {
                  if (pathname === route.myUrls) {
                    setExpanded(false)
                  } else {
                    setRedirect(route.myUrls)
                  }
                }}
              >
                <ItemIcon icon={chartBar} />

                <FormattedMessage id="MyUrlsPage.title" />
              </Navbar.Item>

              <Navbar.Item
                isActive={pathname === route.createUrl}
                onClick={() => setRedirect(route.createUrl)}
              >
                <ItemIcon icon={plusCircle} />

                <FormattedMessage id="CreateUrlPage.title" />
              </Navbar.Item>

              <Navbar.Item
                isActive={pathname === route.settings}
                onClick={() => {
                  if (pathname === route.settings) {
                    setExpanded(false)
                  } else {
                    setRedirect(route.settings)
                  }
                }}
              >
                <ItemIcon icon={userCog} />

                <FormattedMessage id="SettingsPage.title" />
              </Navbar.Item>
            </Navbar.Start>
          )}

          <Navbar.End>
            <Navbar.Item>
              {authenticationIsValid ? (
                <Buttons>
                  <Button
                    onClick={(event) => {
                      pdsp(event)

                      setExpanded(false)

                      if (typeof exit === 'function') {
                        exit()
                      }

                      if (pathname !== route.home) {
                        setRedirect(route.home)
                      }
                    }}
                  >
                    <FormattedMessage id="Navbar.exit" />
                  </Button>
                </Buttons>
              ) : (
                <Buttons>
                  <Button
                    onClick={() => setRedirect(route.enter)}
                  >
                    <FormattedMessage id="Navbar.enter" />
                  </Button>

                  {showCreateAccountButton && (
                    <Button
                      onClick={() => setRedirect(route.createAccount)}
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
