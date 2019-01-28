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

interface IState {
  expiresAt?: string
  hasExpired?: boolean
  isValid: boolean
  token?: string
}

const basePath = "https://api.go-seven.com/v1"

const headersForJson = {
  "Accept": "application/json",
  "Content-Type": "application/json",
}

const checkResponse = (response) => {
  if (response.ok) {
    return response.json()
  } else {
    throw new Error(response.statusText)
  }
}

export function createAccount(credentials: ICredentials) {
  return (dispatch, getState) => {
    dispatch({ type: CREATE_ACCOUNT_REQUEST })

    fetch(`${basePath}/create-account`, {
      body: JSON.stringify(credentials),
      headers: headersForJson,
      method: "POST",
    })
      .then(checkResponse)
      .then(() => { dispatch({ type: CREATE_ACCOUNT_SUCCESS }) })
      .catch((error) => { dispatch({ type: CREATE_ACCOUNT_FAILURE, error }) })
  }

}

export function exit() { return { type: EXIT } }

const initialState: IState = { isValid: false }

export default function(state = initialState, action) {
  switch (action.type) {
    case EXIT:
      return { ...state, token: null }

    default: return state
  }
}
