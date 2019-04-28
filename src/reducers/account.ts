import asyncActions from "../asyncActions"
import * as client from "../client"

export const AUTHENTICATION = asyncActions("AUTHENTICATION")
export const CHECK_AUTHENTICATION = "CHECK_AUTHENTICATION"
export const CREATE_ACCOUNT = asyncActions("CREATE_ACCOUNT")
export const DELETE_ACCOUNT = asyncActions("DELETE_ACCOUNT")
export const EXIT = "EXIT"
const RESET_AUTHENTICATION_ERROR = "RESET_AUTHENTICATION_ERROR"
const SEND_PASSWORD_RESET = asyncActions("SEND_PASSWORD_RESET")
export const SEND_VERIFICATION = asyncActions("SEND_VERIFICATION")

export const initialState: IAccountState = {
  authentication: null,
  emailVerificationSent: false,
  isCreating: false,
  isDeleting: false,
  isEntering: false,
  isSendingPasswordReset: false,
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
  isSendingPasswordReset: boolean
  isSendingVerification: boolean
}

export function createAccount(credentials: ICredentials) {
  const { FAILURE, SUCCESS, REQUEST } = CREATE_ACCOUNT

  return (dispatch, getState) => {
    dispatch({ type: REQUEST })

    client.post("/account", credentials).then(
      () => dispatch({ type: SUCCESS }),
      (error) => dispatch({ error: client.parseError(error), type: FAILURE }),
    )
  }
}

export function deleteAccount() {
  const { FAILURE, SUCCESS, REQUEST } = DELETE_ACCOUNT

  return (dispatch, getState) => {
    const { account } = getState()

    const { token } = account.authentication

    dispatch({ type: REQUEST })

    client.del("/account", token).then(
      () => dispatch({ type: SUCCESS }),
      (error) => dispatch({ error: client.parseError(error), type: FAILURE }),
    )
  }
}

export function enter(credentials: ICredentials) {
  const { FAILURE, SUCCESS, REQUEST } = AUTHENTICATION

  return (dispatch, getState) => {
    dispatch({ type: REQUEST })

    client.post("/enter", credentials).then(
      (data) => dispatch({ data, type: SUCCESS }),
      (error) => dispatch({ error: client.parseError(error), type: FAILURE }),
    )
  }
}

export function exit() { return { type: EXIT } }

export function resetAuthenticationError() { return { type: RESET_AUTHENTICATION_ERROR } }

export function sendPasswordReset(email) {
  const { FAILURE, SUCCESS, REQUEST } = SEND_PASSWORD_RESET

  return (dispatch, getState) => {
    dispatch({ type: REQUEST })

    client.post("/reset-password", { email }).then(
      (data) => dispatch({ data, type: SUCCESS }),
      (error) => dispatch({ error: client.parseError(error), type: FAILURE })
    )
  }
}

export function sendVerification(email) {
  const { FAILURE, SUCCESS, REQUEST } = SEND_VERIFICATION

  return (dispatch, getState) => {
    dispatch({ type: REQUEST })

    client.post("/send-verification", { email }).then(
      (data) => dispatch({ data, type: SUCCESS }),
      (error) => dispatch({ error: client.parseError(error), type: FAILURE }),
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

    case SEND_PASSWORD_RESET.FAILURE:
      return {
        ...state,
        isSendingPasswordReset: false,
      }

    case SEND_PASSWORD_RESET.REQUEST:
      return {
        ...state,
        isSendingPasswordReset: true,
      }

    case SEND_PASSWORD_RESET.SUCCESS:
      return {
        ...state,
        isSendingPasswordReset: false,
        passwordResetEmailSent: true,
      }

    case SEND_VERIFICATION.FAILURE:
      return {
        ...state,
        isSendingVerification: false,
      }

    case SEND_VERIFICATION.REQUEST:
      return {
        ...state,
        isSendingVerification: true,
      }

    case SEND_VERIFICATION.SUCCESS:
      return {
        ...state,
        emailVerificationSent: true,
        isSendingVerification: false,
      }

    default: return state
  }
}
