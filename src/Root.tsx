import * as React from "react"
import { Provider } from "react-redux"
import {
  BrowserRouter,
  Redirect,
  Route,
  Switch,
} from "react-router-dom"
import { Store } from "redux"

import CreateAccountPage from "./pages/CreateAccountPage"
import EnterPage from "./pages/EnterPage"
import HomePage from "./pages/HomePage"
import PasswordResetPage from "./pages/PasswordResetPage"
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage"
import SettingsPage from "./pages/SettingsPage"
import TermsOfServicePage from "./pages/TermsOfServicePage"
import UrlCollectionPage from "./pages/UrlCollectionPage"

import {
  CHECK_AUTHENTICATION,
} from "./reducers/account"

interface IProps {
  store: Store
}

export default class Root extends React.Component<IProps> {
  componentDidMount() {
    this.props.store.dispatch({ type: CHECK_AUTHENTICATION })
  }

  render() {
    const {
      store,
    } = this.props

    return (
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Route component={CreateAccountPage} exact path={CreateAccountPage.path} />

            <Route component={EnterPage} exact path={EnterPage.path} />

            <Route component={HomePage} exact path={HomePage.path} />

            <Route component={PasswordResetPage} exact path={PasswordResetPage.path} />

            <Route component={PrivacyPolicyPage} exact path={PrivacyPolicyPage.path} />

            <Route component={SettingsPage} exact path={SettingsPage.path} />

            <Route component={TermsOfServicePage} exact path={TermsOfServicePage.path} />

            <Route component={UrlCollectionPage} exact path={UrlCollectionPage.path} />

            <Redirect from="*" to={HomePage.path} />
          </Switch>
        </BrowserRouter>
      </Provider>
    )
  }
}
