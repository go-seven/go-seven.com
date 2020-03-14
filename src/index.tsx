import * as React from 'react'
import { render } from 'react-dom'

import { version } from '../package.json'
import configureStore from './store/configureStore'
import Root from './Root'

import { initialState } from './reducers'

window.addEventListener('load', () => {
  // Register service worker,
  // put it in the root public directory, i.e. under the max scope.
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(`cache.v${version}.js`, { scope: '/' }).then(
      () => { console.log(`Registered serviceWorker, Go Seven v${version}`) },
      (error) => { console.error(error) }
    )
  }

  const splashscreen = document.querySelector('.splashscreen') as HTMLElement
  const root = document.getElementById('root') as HTMLElement

  // Hide splashscreen.
  splashscreen.style.display = 'none'

  // Mount app.
  render(<Root store={configureStore(initialState)} />, root)
})
