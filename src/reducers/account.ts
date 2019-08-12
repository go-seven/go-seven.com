import asyncActions from "../asyncActions"
import * as client from "../client"

export const CHANGE_PASSWORD = asyncActions("CHANGE_PASSWORD")
export const CHECK_AUTHENTICATION = "CHECK_AUTHENTICATION"
const CLEANUP_AUTHENTICATION_ERROR = "CLEANUP_AUTHENTICATION_ERROR"
export const CREATE_ACCOUNT = asyncActions("CREATE_ACCOUNT")
export const DELETE_ACCOUNT = asyncActions("DELETE_ACCOUNT")
export const ENTER_ACCOUNT = asyncActions("ENTER_ACCOUNT")
export const EXIT_ACCOUNT = "EXIT_ACCOUNT"
export const SEND_PASSWORD_RESET = asyncActions("SEND_PASSWORD_RESET")
export const SEND_VERIFICATION = asyncActions("SEND_VERIFICATION")

export interface ICredentials {
  email: string
  password: string
}

interface IError {
  code: string
}

export interface IAuthentication {
  expiresAt?: string
  hasExpired?: boolean
  isValid: boolean
  token?: string
}

export interface IAccountState {
  authentication: IAuthentication | null
  domain: string
  email?: string | null
  emailVerificationSent: boolean
  error?: IError
  id?: string,
  isChangingPassword: boolean
  isCreating: boolean
  isDeleting: boolean
  isEntering: boolean
  isSendingPasswordReset: boolean
  isSendingVerification: boolean
  justCreated?: boolean
  justDeleted?: boolean
}

export const initialState: IAccountState = {
  authentication: null,
  domain: "go7.li",
  emailVerificationSent: false,
  isChangingPassword: false,
  isCreating: false,
  isDeleting: false,
  isEntering: false,
  isSendingPasswordReset: false,
  isSendingVerification: false,
}

export function changePassword(password) {
  const { FAILURE, SUCCESS, REQUEST } = CHANGE_PASSWORD

  return (dispatch, getState) => {
    dispatch({ type: REQUEST })

    const { account: { authentication: { token } } } = getState()

    client.post("/change-password", { password }, token).then(
      () => dispatch({ type: SUCCESS }),
      (error) => dispatch({ error: client.parseError(error), type: FAILURE }),
    )
  }
}

export function cleanupAuthenticationError() { return { type: CLEANUP_AUTHENTICATION_ERROR } }

export function createAccount(credentials: ICredentials) {
  const { FAILURE, SUCCESS, REQUEST } = CREATE_ACCOUNT

  return (dispatch) => {
    dispatch({ type: REQUEST })

    client.post("/account", credentials).then(
      () => dispatch({ data: { email: credentials.email }, type: SUCCESS }),
      (error) => dispatch({ error: client.parseError(error), type: FAILURE }),
    )
  }
}

export function deleteAccount() {
  const { FAILURE, SUCCESS, REQUEST } = DELETE_ACCOUNT

  return (dispatch, getState) => {
    const { account: { authentication: { token } } } = getState()

    dispatch({ type: REQUEST })

    client.del("/account", token).then(
      () => dispatch({ type: SUCCESS }),
      (error) => dispatch({ error: client.parseError(error), type: FAILURE }),
    )
  }
}

export function enterAccount(credentials: ICredentials) {
  const { FAILURE, SUCCESS, REQUEST } = ENTER_ACCOUNT

  return (dispatch) => {
    dispatch({ type: REQUEST })

    client.post("/enter", credentials).then(
      ({ accountId, token, expiresAt }) => {
        const { email } = credentials

        dispatch({
          data: {
            authentication: { token, expiresAt },
            email,
            id: accountId,
          },
          type: SUCCESS
        })
      },
      (error) => dispatch({ error: client.parseError(error), type: FAILURE }),
    )
  }
}

export function exitAccount() { return { type: EXIT_ACCOUNT } }

export function sendPasswordReset(email) {
  const { FAILURE, SUCCESS, REQUEST } = SEND_PASSWORD_RESET

  return (dispatch) => {
    dispatch({ type: REQUEST })

    client.post("/reset-password", { email }).then(
      () => dispatch({ data: { email }, type: SUCCESS }),
      (error) => dispatch({ error: client.parseError(error), type: FAILURE })
    )
  }
}

export function sendVerification(email) {
  const { FAILURE, SUCCESS, REQUEST } = SEND_VERIFICATION

  return (dispatch) => {
    dispatch({ type: REQUEST })

    client.post("/send-verification", { email }).then(
      (data) => dispatch({ data, type: SUCCESS }),
      (error) => dispatch({ error: client.parseError(error), type: FAILURE }),
    )
  }
}

export default function(state = initialState, action) {
  switch (action.type) {
    case CHANGE_PASSWORD.FAILURE:
      return {
        ...state,
        error: action.error,
        isChangingPassword: false,
      }

    case CHANGE_PASSWORD.REQUEST:
      return {
        ...state,
        error: null,
        isChangingPassword: true,
      }

    case CHANGE_PASSWORD.SUCCESS:
      return {
        ...state,
        isChangingPassword: false,
      }

    case CHECK_AUTHENTICATION:
      return {
        ...state,
        ...action.data,
      }

    case CLEANUP_AUTHENTICATION_ERROR:
      return {
        ...state,
        error: null,
      }

    case CREATE_ACCOUNT.FAILURE:
      return {
        ...state,
        authentication: {
          isValid: false,
        },
        error: action.error,
        isCreating: false,
        justCreated: false,
      }

    case CREATE_ACCOUNT.REQUEST:
      return {
        ...state,
        authentication: {
          isValid: false,
        },
        error: null,
        isCreating: true,
        justCreated: false,
      }

    case CREATE_ACCOUNT.SUCCESS:
      return {
        ...state,
        authentication: {
          isValid: false,
        },
        email: action.data.email,
        isCreating: false,
        justCreated: true,
      }

    case DELETE_ACCOUNT.FAILURE:
      return {
        ...state,
        error: action.error,
        isDeleting: false,
        justDeleted: false,
      }

    case DELETE_ACCOUNT.REQUEST:
      return {
        ...state,
        isDeleting: true,
        justDeleted: false,
      }

    case DELETE_ACCOUNT.SUCCESS:
      return {
        ...initialState,
        justDeleted: true,
      }

    case ENTER_ACCOUNT.FAILURE:
      return {
        ...state,
        error: action.error,
        isEntering: false,
      }

    case ENTER_ACCOUNT.REQUEST:
      return {
        ...state,
        error: null,
        isEntering: true,
      }

    case ENTER_ACCOUNT.SUCCESS:
      return {
        ...state,
        authentication: {
          ...action.data.authentication,
          isValid: true,
        },
        email: action.data.email,
        id: action.data.id,
        isEntering: false,
      }

    case EXIT_ACCOUNT:
      return {
        ...initialState,
        email: state.email
      }

    case SEND_PASSWORD_RESET.FAILURE:
      return {
        ...state,
        error: action.error,
        isSendingPasswordReset: false,
      }

    case SEND_PASSWORD_RESET.REQUEST:
      return {
        ...state,
        error: null,
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
