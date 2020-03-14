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

import i18nConfig from './i18n/i18nConfig'

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

import route from './routes'

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
              {[
                { component: CreateAccountPage, path: route.createAccount },
                { component: CreateUrlPage, path: route.createUrl },
                { component: CreateUrlPage, path: route.createUrl },
                { component: EnterPage, path: route.enter },
                { component: HomePage, path: route.home },
                { component: MyUrlsPage, path: route.myUrls },
                { component: PasswordResetPage, path: route.passwordReset },
                { component: PrivacyPolicyPage, path: route.privacyPolicy },
                { component: SettingsPage, path: route.settings },
                { component: TermsOfServicePage, path: route.termsOfService },
                { component: UrlPage, path: route.url },
              ].map(({ component, path }, i) => (
                <Route
                  component={component}
                  exact
                  key={i}
                  path={path}
                />
              ))}

              <Redirect from="*" to={route.home} />
            </Switch>
          </BrowserRouter>
        </Provider>
      </IntlProvider>
    )
  }
}
