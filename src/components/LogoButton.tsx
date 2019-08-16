import * as React from 'react'
import { Redirect } from 'react-router-dom'
import {
  Image
} from 'trunx'

import HomePage from '../pages/HomePage'

interface IProps {
  disabledClick?: boolean
}

export default function LogoButton ({
  disabledClick
}: IProps) {
  const [redirect, setRedirect] = React.useState('')

  const onClickLogo = () => {
    setRedirect(HomePage.path)
  }

  if (redirect) {
    return (
      <Redirect push to={redirect} />
    )
  }

  return (
    <div className="logo-button">
      <Image
        alt=""
        height="34"
        onClick={disabledClick === true ? undefined : onClickLogo}
        src="/media/logo.svg"
        width="34"
      />
    </div>
  )
}
