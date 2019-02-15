// A Collection is a set of URLs. Every collection has an identifier and a name.
// User can organize its URLs into collections.
// If no collection is selected there is always a "default" collection which includes all URLs.
import * as client from "../client"

const asyncActions = (NAME) => ({
  FAILURE: `${NAME}_FAILURE`,
  REQUEST: `${NAME}_REQUEST`,
  SUCCESS: `${NAME}_SUCCESS`,
})

const CREATE_URL = asyncActions("CREATE_URL")
const FETCH_COLLECTION = asyncActions("FETCH_COLLECTION")
const SET_WANTED_URL = "SET_WANTED_URL"
const URL_ID_EXISTS = asyncActions("URL_ID_EXISTS")

export interface IUrl {
  href: string
  id?: string
  title?: string
}

export interface ICollection {
  id: string
  name: string
  urls: IUrl[]
}

export interface ICollectionsState {
  current: ICollection | null
  selected: string
  itIsCheckingIfUrlIdExists: boolean
  itIsCreatingUrl: boolean
  wantedUrl: IUrl | null
}

export const initialState: ICollectionsState = {
  current: null,
  itIsCheckingIfUrlIdExists: false,
  itIsCreatingUrl: false,
  selected: "default",
  wantedUrl: null,
}

export function createUrl(url: IUrl) {
  return (dispatch, getState) => {
    const {
      account,
      collections,
    } = getState()

    const {
      token,
    } = account.authentication

    const collectionId = collections.selected

    dispatch({
      type: CREATE_URL.REQUEST
    })

    client.post("/url", { collectionId, url }, token)
      .then((data) => { dispatch({ data, type: CREATE_URL.SUCCESS }) })
      .catch((error) => { dispatch({ error, type: CREATE_URL.FAILURE }) })
  }
}

function fetchCollection(token, id) {
  return (dispatch, getState) => {
    dispatch({ type: FETCH_COLLECTION.REQUEST, id })

    client.get(`/url-collection/${id}`, token)
      .then((data) => { dispatch({ data, type: FETCH_COLLECTION.SUCCESS }) })
      .catch((error) => { dispatch({ error, type: FETCH_COLLECTION.FAILURE }) })
  }

}

export function fetchCollectionIfNeeded() {
  return (dispatch, getState) => {
    const {
      account,
      collections,
    } = getState()

    const {
      token
    } = account.authentication

    const {
      current,
      selected,
    } = collections

    if (shouldFetchCollection({ current, selected })) {
      return dispatch(fetchCollection(token, selected))
    }
  }
}

export function setWantedUrl(url: IUrl) {
  return (dispatch, getState) => {
    const {
      wantedUrl
    } = getState()

    const urlIdChanged = wantedUrl ? (wantedUrl.id === url.id) : true

    if (urlIdChanged) {
      dispatch({ data: url, type: URL_ID_EXISTS.REQUEST })
    } else {
      return {
        data: url,
        type: SET_WANTED_URL,
      }
    }
  }
}

export function shouldFetchCollection({ current, selected }) {
  if (current === null) {
    return true
  } else {
    return current.id === selected
  }
}

export default function(state = initialState, action) {
  switch (action.type) {
    case CREATE_URL.FAILURE:
      return {
        ...state,
        itIsCreatingUrl: false,
      }

    case CREATE_URL.REQUEST:
      return {
        ...state,
        itIsCreatingUrl: true,
      }

    case CREATE_URL.SUCCESS:
      return {
        ...state,
        itIsCreatingUrl: false,
      }

    case FETCH_COLLECTION.FAILURE:
      return {
        ...state,
      }

    case FETCH_COLLECTION.REQUEST:
      return {
        ...state,
      }

    case FETCH_COLLECTION.SUCCESS:
      return {
        ...state,
        current: action.data
      }

    case SET_WANTED_URL:
      return {
        ...state,
        wantedUrl: action.data
      }

    case URL_ID_EXISTS.FAILURE:
      return {
        ...state,
        itIsCheckingIfUrlIdExists: false,
      }

    case URL_ID_EXISTS.REQUEST:
      return {
        ...state,
        itIsCheckingIfUrlIdExists: true,
        wantedUrl: action.data
      }

    case URL_ID_EXISTS.SUCCESS:
      return {
        ...state,
        itIsCheckingIfUrlIdExists: false,
      }

    default: return state
  }
}
