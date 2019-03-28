import * as React from "react"
import { Provider } from "react-redux"
import {
  BrowserRouter,
  Redirect,
  Route,
  Switch,
} from "react-router-dom"
import { Store } from "redux"

import CreateAccount from "./pages/CreateAccount"
import CreateUrl from "./pages/CreateUrl"
import Enter from "./pages/Enter"
import Homepage from "./pages/Homepage"
import PrivacyPolicy from "./pages/PrivacyPolicy"
import Settings from "./pages/Settings"
import TermsOfService from "./pages/TermsOfService"
import UrlCollections from "./pages/UrlCollections"

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
            <Route component={CreateAccount} exact path={CreateAccount.path} />

            <Route component={CreateUrl} exact path={CreateUrl.path} />

            <Route component={Enter} exact path={Enter.path} />

            <Route component={Homepage} exact path={Homepage.path} />

            <Route component={PrivacyPolicy} exact path={PrivacyPolicy.path} />

            <Route component={Settings} exact path={Settings.path} />

            <Route component={TermsOfService} exact path={TermsOfService.path} />

            <Route component={UrlCollections} exact path={UrlCollections.path} />

            <Redirect from="*" to={Homepage.path} />
          </Switch>
        </BrowserRouter>
      </Provider>
    )
  }
}
