// A Collection is a set of URLs. Every collection has an identifier and a name.
// User can organize its URLs into collections.
// If no collection is selected there is always a "default" collection which includes all URLs.
import * as client from "../client"

const CREATE_URL_FAILURE = "CREATE_URL_FAILURE"
const CREATE_URL_REQUEST = "CREATE_URL_REQUEST"
const CREATE_URL_SUCCESS = "CREATE_URL_SUCCESS"
const FETCH_COLLECTION_FAILURE = "FETCH_COLLECTION_FAILURE"
const FETCH_COLLECTION_REQUEST = "FETCH_COLLECTION_REQUEST"
const FETCH_COLLECTION_SUCCESS = "FETCH_COLLECTION_SUCCESS"
const SET_WANTED_URL = "SET_WANTED_URL"

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
  itIsCreatingUrl: boolean
  wantedUrl: IUrl | null
}

export const initialState: ICollectionsState = {
  current: null,
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
      type: CREATE_URL_REQUEST
    })

    client.post("/url", { collectionId, url }, token)
      .then((data) => { dispatch({ data, type: CREATE_URL_SUCCESS }) })
      .catch((error) => { dispatch({ error, type: CREATE_URL_FAILURE }) })
  }
}

function fetchCollection(token, id) {
  return (dispatch, getState) => {
    dispatch({ type: FETCH_COLLECTION_REQUEST, id })

    client.get(`/url-collection/${id}`, token)
      .then((data) => { dispatch({ data, type: FETCH_COLLECTION_SUCCESS }) })
      .catch((error) => { dispatch({ error, type: FETCH_COLLECTION_FAILURE }) })
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
  return {
    data: url,
    type: SET_WANTED_URL,
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
    case CREATE_URL_FAILURE:
      return {
        ...state,
        itIsCreatingUrl: false,
      }

    case CREATE_URL_REQUEST:
      return {
        ...state,
        itIsCreatingUrl: true,
      }

    case CREATE_URL_SUCCESS:
      return {
        ...state,
        itIsCreatingUrl: false,
      }

    case FETCH_COLLECTION_FAILURE:
      return {
        ...state,
      }

    case FETCH_COLLECTION_REQUEST:
      return {
        ...state,
      }

    case FETCH_COLLECTION_SUCCESS:
      return {
        ...state,
        current: action.data
      }

    case SET_WANTED_URL:
      return {
        ...state,
        wantedUrl: action.data
      }

    default: return state
  }
}
