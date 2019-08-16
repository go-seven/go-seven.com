import * as React from 'react'
import { render } from 'react-dom'

import { version } from '../package.json'
import configureStore from './store/configureStore'
import Root from './Root'

import { initialState as account } from './reducers/account'
import { initialState as urlCollections } from './reducers/urlCollections'

const initialState = {
  account,
  urlCollections
}

window.addEventListener('load', () => {
  // Register service worker, it is better to put it in the root public directory, i.e. under the max scope.
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(`cache.v${version}.js`, { scope: '/' })
  }

  setTimeout(() => {
    // Hide splashscreen.
    const splashscreen = document.querySelector('.splashscreen') as HTMLElement
    splashscreen.style.display = 'none'

    // Mount app.
    render(<Root store={configureStore(initialState)} />, document.getElementById('root'))
  }, 711)
})
