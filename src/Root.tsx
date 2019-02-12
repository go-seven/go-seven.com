import * as React from "react"
import { Provider } from "react-redux"
import {
  BrowserRouter,
  Redirect,
  Route,
  Switch
} from "react-router-dom"
import { Store } from "redux"

import Create from "./pages/Create"
import CreateAccount from "./pages/CreateAccount"
import Enter from "./pages/Enter"
import Homepage from "./pages/Homepage"
import PrivacyPolicy from "./pages/PrivacyPolicy"
import TermsOfService from "./pages/TermsOfService"

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

            <Route component={Create} exact path={Create.path} />

            <Route component={Enter} exact path={Enter.path} />

            <Route component={Homepage} exact path={Homepage.path} />

            <Route component={PrivacyPolicy} exact path={PrivacyPolicy.path} />

            <Route component={TermsOfService} exact path={TermsOfService.path} />
          </Switch>
        </BrowserRouter>
      </Provider>
    )
  }
}
