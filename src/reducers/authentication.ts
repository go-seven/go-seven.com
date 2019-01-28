const AUTHENTICATION_FAILURE = "AUTHENTICATION_FAILURE"
const AUTHENTICATION_REQUEST = "AUTHENTICATION_REQUEST"
export const AUTHENTICATION_SUCCESS = "AUTHENTICATION_SUCCESS"
export const CHECK_AUTHENTICATION = "CHECK_AUTHENTICATION"
const CREATE_ACCOUNT_FAILURE = "CREATE_ACCOUNT_FAILURE"
const CREATE_ACCOUNT_REQUEST = "CREATE_ACCOUNT_REQUEST"
const CREATE_ACCOUNT_SUCCESS = "CREATE_ACCOUNT_SUCCESS"
export const EXIT = "EXIT"

interface IState {
  expiresAt?: string
  hasExpired?: boolean
  isValid: boolean
  token?: string
}

export function exit() {
  return {
    type: EXIT
  }
}

const initialState: IState = { isValid: false }

export default function(state = initialState, action) {
  switch (action.type) {
    case EXIT:
      return {
        ...state,
        token: null
      }

    default: return state
  }
}
