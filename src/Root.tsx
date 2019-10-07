import * as React from 'react'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import {
  BrowserRouter,
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import { Store } from 'redux'

import i18nConfig from './i18nConfig'

import CreateAccountPage from './pages/CreateAccountPage'
import CreateUrlPage from './pages/CreateUrlPage'
import EnterPage from './pages/EnterPage'
import HomePage from './pages/HomePage'
import MyUrlsPage from './pages/MyUrlsPage'
import PasswordResetPage from './pages/PasswordResetPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import SettingsPage from './pages/SettingsPage'
import TermsOfServicePage from './pages/TermsOfServicePage'
import UrlPage from './pages/UrlPage'

import {
  CHECK_AUTHENTICATION
} from './reducers/account'

const i18n = i18nConfig()

interface IProps {
  store: Store
}

export default class Root extends React.Component<IProps> {
  componentDidMount () {
    this.props.store.dispatch({ type: CHECK_AUTHENTICATION })
  }

  render () {
    const {
      store
    } = this.props

    return (
      <IntlProvider {...i18n}>
        <Provider store={store}>
          <BrowserRouter>
            <Switch>
              <Route component={CreateAccountPage} exact path={CreateAccountPage.path} />

              <Route component={CreateUrlPage} exact path={CreateUrlPage.path} />

              <Route component={EnterPage} exact path={EnterPage.path} />

              <Route component={HomePage} exact path={HomePage.path} />

              <Route component={MyUrlsPage} exact path={MyUrlsPage.path} />

              <Route component={PasswordResetPage} exact path={PasswordResetPage.path} />

              <Route component={PrivacyPolicyPage} exact path={PrivacyPolicyPage.path} />

              <Route component={SettingsPage} exact path={SettingsPage.path} />

              <Route component={TermsOfServicePage} exact path={TermsOfServicePage.path} />

              <Route component={UrlPage} exact path={UrlPage.path} />

              <Redirect from="*" to={HomePage.path} />
            </Switch>
          </BrowserRouter>
        </Provider>
      </IntlProvider>
    )
  }
}
