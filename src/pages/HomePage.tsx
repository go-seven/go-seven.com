import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'

import Features from '../components/Features'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import Pricing from '../components/Pricing'

import {
  exitAccount,
  IAccountState
} from '../reducers/account'

interface IProps extends RouteComponentProps {
  authenticationIsValid: boolean
  email: IAccountState['email']
  exitAccount: () => void
  hasNoEmail: boolean
}

class HomePage extends React.Component<IProps> {
  static path = '/'

  render () {
    const {
      authenticationIsValid,
      exitAccount,
      hasNoEmail
    } = this.props

    return (
      <>
        <Navbar
          authenticationIsValid={authenticationIsValid}
          exit={exitAccount}
          locationPath={this.props.location.pathname}
          showCreateAccountButton={hasNoEmail}
        />

        <Features />

        <Pricing />

        <Footer />
      </>
    )
  }
}

const mapStateToProps = ({
  account: {
    authentication,
    email
  }
}) => ({
  authenticationIsValid: authentication === null ? false : authentication.isValid,
  hasNoEmail: email === ''
})

const mapDispatchToProps = (dispatch) => ({
  exitAccount: () => dispatch(exitAccount())
})

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)
