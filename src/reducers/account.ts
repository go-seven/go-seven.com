import * as client from "../client"

const AUTHENTICATION_FAILURE = "AUTHENTICATION_FAILURE"
const AUTHENTICATION_REQUEST = "AUTHENTICATION_REQUEST"
export const AUTHENTICATION_SUCCESS = "AUTHENTICATION_SUCCESS"
export const CHECK_AUTHENTICATION = "CHECK_AUTHENTICATION"
const CREATE_ACCOUNT_FAILURE = "CREATE_ACCOUNT_FAILURE"
const CREATE_ACCOUNT_REQUEST = "CREATE_ACCOUNT_REQUEST"
const CREATE_ACCOUNT_SUCCESS = "CREATE_ACCOUNT_SUCCESS"
export const EXIT = "EXIT"

export interface ICredentials {
  email: string
  password: string
}

interface IError {
  code: string
  message: string
}

export interface IAuthentication {
  expiresAt?: string
  error?: IError
  hasExpired?: boolean
  isValid: boolean
  isWaiting: boolean
  token?: string
}

export interface IAccountState {
  authentication: IAuthentication | null
}

export function createAccount(credentials: ICredentials) {
  return (dispatch, getState) => {
    dispatch({ type: CREATE_ACCOUNT_REQUEST })

    client.post("/account", credentials)
      .then(() => { dispatch({ type: CREATE_ACCOUNT_SUCCESS }) })
      .catch((error) => { dispatch({ type: CREATE_ACCOUNT_FAILURE, error }) })
  }

}

export function enter(credentials: ICredentials) {
  return (dispatch, getState) => {
    dispatch({ type: AUTHENTICATION_REQUEST })

    client.post("/enter", credentials)
      .then((data) => { dispatch({ type: AUTHENTICATION_SUCCESS, data }) })
      .catch((error) => { dispatch({ type: AUTHENTICATION_FAILURE, error }) })
  }

}
export function exit() { return { type: EXIT } }

export const initialState: IAccountState = {
  authentication: null
}

export default function(state = initialState, action) {
  switch (action.type) {
    case AUTHENTICATION_FAILURE:
      return {
        ...state,
        authentication: {
          ...state.authentication,
          error: action.error,
          isWaiting: false,
        }
      }

    case AUTHENTICATION_REQUEST:
      return {
        ...state,
        authentication: {
          ...state.authentication,
          error: null,
          isWaiting: true,
        }
      }

    case AUTHENTICATION_SUCCESS:
      return {
        ...state,
        authentication: {
          ...action.data,
          isValid: true,
          isWaiting: false,
        }
      }

    case CHECK_AUTHENTICATION:
      return {
        ...state,
        authentication: {
          ...action.data
        }
      }

    case CREATE_ACCOUNT_FAILURE:
      return {
        ...state,
        authentication: {
          error: action.error,
          isValid: false,
          isWaiting: false,
        }
      }

    case CREATE_ACCOUNT_REQUEST:
      return {
        ...state,
        authentication: {
          error: null,
          isValid: false,
          isWaiting: true,
        }
      }

    case CREATE_ACCOUNT_SUCCESS:
      return {
        ...state,
        authentication: {
          error: null,
          isValid: false,
          isWaiting: false,
        }
      }

    case EXIT:
      return initialState

    default: return state
  }
}
