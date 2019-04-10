import asyncActions from "../asyncActions"
import * as client from "../client"

export const AUTHENTICATION = asyncActions("AUTHENTICATION")
export const CHECK_AUTHENTICATION = "CHECK_AUTHENTICATION"
export const CREATE_ACCOUNT = asyncActions("CREATE_ACCOUNT")
export const DELETE_ACCOUNT = asyncActions("DELETE_ACCOUNT")
export const EXIT = "EXIT"
const RESET_AUTHENTICATION_ERROR = "RESET_AUTHENTICATION_ERROR"
export const SEND_VERIFICATION_EMAIL = asyncActions("SEND_VERIFICATION_EMAIL")

export const initialState: IAccountState = {
  authentication: null,
  emailVerificationSent: false,
  isCreating: false,
  isDeleting: false,
  isEntering: false,
  isSendingVerification: false,
}

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
  token?: string
}

export interface IAccountState {
  authentication: IAuthentication | null
  emailVerificationSent: boolean
  isCreating: boolean
  isDeleting: boolean
  isEntering: boolean
  isSendingVerification: boolean
}

export function createAccount(credentials: ICredentials) {
  return (dispatch, getState) => {
    dispatch({ type: CREATE_ACCOUNT.REQUEST })

    client.post("/account", credentials).then(
      () => dispatch({ type: CREATE_ACCOUNT.SUCCESS }),
      (error) => dispatch({ error: client.parseError(error), type: CREATE_ACCOUNT.FAILURE }),
    )
  }
}

export function deleteAccount() {
  return (dispatch, getState) => {
    const {
      account,
    } = getState()

    const {
      token,
    } = account.authentication

    dispatch({ type: DELETE_ACCOUNT.REQUEST })

    client.del("/account", token).then(
      () => dispatch({ type: DELETE_ACCOUNT.SUCCESS }),
      (error) => dispatch({ error: client.parseError(error), type: DELETE_ACCOUNT.FAILURE }),
    )
  }
}

export function enter(credentials: ICredentials) {
  return (dispatch, getState) => {
    dispatch({ type: AUTHENTICATION.REQUEST })

    client.post("/enter", credentials).then(
      (data) => dispatch({ data, type: AUTHENTICATION.SUCCESS }),
      (error) => dispatch({ error: client.parseError(error), type: AUTHENTICATION.FAILURE }),
    )
  }
}

export function exit() { return { type: EXIT } }

export function resetAuthenticationError() { return { type: RESET_AUTHENTICATION_ERROR } }

export function sendVerificationEmail(email) {
  return (dispatch, getState) => {
    dispatch({ type: SEND_VERIFICATION_EMAIL.REQUEST })

    client.post("/send-verification", { email }).then(
      (data) => dispatch({ data, type: SEND_VERIFICATION_EMAIL.SUCCESS }),
      (error) => dispatch({ error: client.parseError(error), type: SEND_VERIFICATION_EMAIL.FAILURE }),
    )
  }
}

export default function(state = initialState, action) {
  switch (action.type) {
    case AUTHENTICATION.FAILURE:
      return {
        ...state,
        authentication: {
          ...state.authentication,
          error: action.error,
        },
        isEntering: false,
      }

    case AUTHENTICATION.REQUEST:
      return {
        ...state,
        authentication: {
          ...state.authentication,
          error: null,
        },
        isEntering: true,
      }

    case AUTHENTICATION.SUCCESS:
      return {
        ...state,
        authentication: {
          ...action.data,
          isValid: true,
        },
        isEntering: false,
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
        },
        isCreating: false,
      }

    case CREATE_ACCOUNT.REQUEST:
      return {
        ...state,
        authentication: {
          error: null,
          isValid: false,
        },
        isCreating: true,
      }

    case CREATE_ACCOUNT.SUCCESS:
      return {
        ...state,
        authentication: {
          error: null,
          isValid: false,
        },
        isCreating: false,
      }

    case DELETE_ACCOUNT.FAILURE:
      return {
        ...state,
        isDeleting: false,
      }

    case DELETE_ACCOUNT.REQUEST:
      return {
        ...state,
        isDeleting: true,
      }

    case DELETE_ACCOUNT.SUCCESS:
      return {
        ...state,
        isDeleting: false,
      }

    case EXIT:
      return initialState

    case RESET_AUTHENTICATION_ERROR:
      return {
        ...state,
        authentication: {
          ...state.authentication,
          error: null,
        }
      }

    case SEND_VERIFICATION_EMAIL.FAILURE:
      return {
        ...state,
        isSendingVerification: false,
      }

    case SEND_VERIFICATION_EMAIL.REQUEST:
      return {
        ...state,
        isSendingVerification: true,
      }

    case SEND_VERIFICATION_EMAIL.SUCCESS:
      return {
        ...state,
        emailVerificationSent: true,
        isSendingVerification: false,
      }

    default: return state
  }
}
