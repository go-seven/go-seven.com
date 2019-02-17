import asyncActions from "../asyncActions"
import * as client from "../client"

export const AUTHENTICATION = asyncActions("AUTHENTICATION")
export const CHECK_AUTHENTICATION = "CHECK_AUTHENTICATION"
const CREATE_ACCOUNT = asyncActions("CREATE_ACCOUNT")
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
    dispatch({ type: CREATE_ACCOUNT.REQUEST })

    client.post("/account", credentials).then(
      () => dispatch({ type: CREATE_ACCOUNT.SUCCESS }),
      (error) => dispatch({ error: JSON.parse(error), type: CREATE_ACCOUNT.FAILURE }),
    )
  }

}

export function enter(credentials: ICredentials) {
  return (dispatch, getState) => {
    dispatch({ type: AUTHENTICATION.REQUEST })

    client.post("/enter", credentials).then(
      (data) => dispatch({ data, type: AUTHENTICATION.SUCCESS }),
      (error) => dispatch({ error: JSON.parse(error), type: AUTHENTICATION.FAILURE }),
    )
  }

}
export function exit() { return { type: EXIT } }

export const initialState: IAccountState = {
  authentication: null
}

export default function(state = initialState, action) {
  switch (action.type) {
    case AUTHENTICATION.FAILURE:
      return {
        ...state,
        authentication: {
          ...state.authentication,
          error: action.error,
          isWaiting: false,
        }
      }

    case AUTHENTICATION.REQUEST:
      return {
        ...state,
        authentication: {
          ...state.authentication,
          error: null,
          isWaiting: true,
        }
      }

    case AUTHENTICATION.SUCCESS:
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

    case CREATE_ACCOUNT.FAILURE:
      return {
        ...state,
        authentication: {
          error: action.error,
          isValid: false,
          isWaiting: false,
        }
      }

    case CREATE_ACCOUNT.REQUEST:
      return {
        ...state,
        authentication: {
          error: null,
          isValid: false,
          isWaiting: true,
        }
      }

    case CREATE_ACCOUNT.SUCCESS:
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
