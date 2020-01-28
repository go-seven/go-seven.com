import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect /*, RouteComponentProps */ } from 'react-router-dom'

import { HomepageHero } from '../components/HomepageHero'

import {
  exitAccount,
} from '../reducers/account'

import routes from '../routes'

const { useState } = React

/* interface IProps extends RouteComponentProps { */
/*   authenticationIsValid: boolean */
/*   exitAccount: () => void */
/*   hasNoEmail: boolean */
/* } */

function HomePage (/* {
  authenticationIsValid,
  exitAccount,
  hasNoEmail,
  }: IProps */) {
  const [redirect, setRedirect] = useState()

  const onClickEnter = () => setRedirect(routes.enter)

  const onClickRegister = () => setRedirect(routes.createAccount)

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
        onClickEnter={onClickEnter}
        onClickRegister={onClickRegister}
      />
    </>
  )
}

const mapStateToProps = ({
  account: {
    /* authentication, */
    email,
  }
}) => ({
  /* authenticationIsValid: authentication === null ? false : authentication.isValid, */
  hasNoEmail: email === '',
})

const mapDispatchToProps = (dispatch) => ({
  exitAccount: () => dispatch(exitAccount())
})

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)
