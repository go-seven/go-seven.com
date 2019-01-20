import * as React from "react"
import {
  BrowserRouter,
  Redirect,
  Route,
  Switch
} from "react-router-dom"

import Homepage from "./pages/Homepage"

export default class Root extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route component={Homepage} exact path={Homepage.path} />
        </Switch>
      </BrowserRouter>
    )
  }
}
