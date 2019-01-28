import * as React from "react"

import {
  Image,
  Navbar,
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
            <Image
              alt="GoSeven Logo"
              src="/media/logo-48x48.png"
            />
          </Navbar.Item>
        </Navbar.Brand>
      </Navbar>

    )
  }
}
