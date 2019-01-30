import * as React from "react"
import {
  BrowserRouter,
  Redirect,
  Route,
  Switch
} from "react-router-dom"

import CreateAccount from "./pages/CreateAccount"
import Enter from "./pages/Enter"
import Homepage from "./pages/Homepage"
import PrivacyPolicy from "./pages/PrivacyPolicy"
import TermsOfService from "./pages/TermsOfService"

export default class Root extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route component={CreateAccount} exact path={CreateAccount.path} />

          <Route component={Enter} exact path={Enter.path} />

          <Route component={Homepage} exact path={Homepage.path} />

          <Route component={PrivacyPolicy} exact path={PrivacyPolicy.path} />

          <Route component={TermsOfService} exact path={TermsOfService.path} />
        </Switch>
      </BrowserRouter>
    )
  }
}
