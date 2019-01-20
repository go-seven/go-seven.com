import * as React from "react"

import {
  Navbar
} from "trunx"

export default class Nav extends React.Component {
  render() {
    return (
      <Navbar
        aria-label="main navigation"
        isFixedTop
        isPrimary
        role="navigation"
      >
        <Navbar.Brand>
          <Navbar.Item>
            <img
              alt="Logo"
              src="/media/logo-60x60.png"
            />
          </Navbar.Item>
        </Navbar.Brand>
      </Navbar>

    )
  }
}
