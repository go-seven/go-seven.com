import {
  applyMiddleware,
  compose,
  createStore,
  Store
} from 'redux'
import thunkMiddleware from 'redux-thunk'

import webStorageMiddleware from '../middlewares/webStorage'

import reducers from '../reducers'

export default function configureStore (state): Store {
  return createStore(
    reducers,
    state,
    compose(
      applyMiddleware(
        thunkMiddleware,
        webStorageMiddleware
      ),
      /* eslint-disable-next-line */ /* tslint:disable-next-line:no-string-literal */
      window['__REDUX_DEVTOOLS_EXTENSION__'] ? window['__REDUX_DEVTOOLS_EXTENSION__']() : (storeCreator) => storeCreator
    )
  )
}
