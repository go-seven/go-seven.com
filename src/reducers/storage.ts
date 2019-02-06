import * as client from "../client"

const CREATE_URL_FAILURE = "CREATE_URL_FAILURE"
const CREATE_URL_REQUEST = "CREATE_URL_REQUEST"
const CREATE_URL_SUCCESS = "CREATE_URL_SUCCESS"

interface IUrl {
  href: string
  title?: string
}

interface IStorageState {

}

export function createUrl(url: IUrl) {
  return (dispatch, getState) => {
    const { authentication } = getState()

    dispatch({
      type: CREATE_URL_REQUEST
    })

    client.post("/url", url, authentication)
      .then((url) => { dispatch({ type: CREATE_URL_SUCCESS, url }) })
      .catch((error) => { dispatch({ type: CREATE_URL_FAILURE, error }) })
  }
}

export const initialState: IStorageState = {
}

export default function(state = initialState, action) {
  switch (action.type) {
    case CREATE_URL_FAILURE:
      return {
        ...state,
      }

    case CREATE_URL_REQUEST:
      return {
        ...state,
      }

    case CREATE_URL_SUCCESS:
      return {
        ...state,
      }

    default: return state
  }
}
