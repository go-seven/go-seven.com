import * as React from 'react'
import { useState } from 'react'
import { connect } from 'react-redux'
import { Redirect /*, RouteComponentProps */ } from 'react-router-dom'
import { bindActionCreators } from 'redux'

import { HomepageHero } from '../components/HomepageHero'

import {
  exitAccount,
} from '../reducers/account'

import pagePath from './paths'

function HomePage () {
  const [redirect, setRedirect] = useState('')

  if (redirect) {
    return (
      <Redirect push to={redirect} />
    )
  }

  return (
    <>
      <HomepageHero
        borderRadius={10}
        color="#fff"
        logoImage="images/logotype.png"
        isMobile={false}
        onClickEnter={() => setRedirect(pagePath.enter())}
        onClickRegister={() => setRedirect(pagePath.createAccount())}
      />
    </>
  )
}

const mapStateToProps = ({
  account: {
    email,
  }
}) => ({
  hasNoEmail: email === '',
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  exitAccount,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)
