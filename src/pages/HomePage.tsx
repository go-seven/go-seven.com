import { Frame, Scroll, Stack } from 'framer'
import * as React from 'react'
import { useState } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { bindActionCreators } from 'redux'

import { HomepageFeatures } from '../components/HomepageFeatures'
import { HomepageHero } from '../components/HomepageHero'
import { HomepagePricing } from '../components/HomepagePricing'
import { HomepageRegister } from '../components/HomepageRegister'
import { HomepageTransparency } from '../components/HomepageTransparency'

import { useWindowDimensions } from '../hooks/useWindowDimensions'

import {
  exitAccount,
} from '../reducers/account'

import pagePath from './paths'

function HomePage () {
  const [redirect, setRedirect] = useState('')

  const { width: windowWidth, height: windowHeight } = useWindowDimensions()

  if (redirect) {
    return (
      <Redirect push to={redirect} />
    )
  }

  return (
    <Scroll
      height="100%"
      width="100%"
    >
      <Stack
        direction="vertical"
        distribution="start"
        gap={0}
        height={windowHeight * 4}
        padding={0}
        width={windowWidth}
      >
        <Frame
          height={windowHeight}
          width={windowWidth}
        >
          <HomepageHero
            borderRadius={10}
            color="#fff"
            logoImage="images/logotype.png"
            isMobile={false}
            onClickEnter={() => setRedirect(pagePath.enter())}
            onClickRegister={() => setRedirect(pagePath.createAccount())}
          />
        </Frame>

        <Frame
          width={windowWidth}
        >
          <HomepageFeatures />
        </Frame>

        <Frame
          width={windowWidth}
        >
          <HomepageRegister />
        </Frame>

        <Frame
          width={windowWidth}
        >
          <HomepageTransparency />
        </Frame>

        <Frame
          width={windowWidth}
        >
          <HomepagePricing />
        </Frame>
      </Stack>
    </Scroll>
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
