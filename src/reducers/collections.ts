// A Collection is a set of URLs. Every collection has an identifier and a name.
// User can organize its URLs into collections.
// If no collection is selected there is always a "default" collection which includes all URLs.
import * as urlRegex from "regex-weburl"

import asyncActions from "../asyncActions"
import * as client from "../client"

const CREATE_URL = asyncActions("CREATE_URL")
const FETCH_COLLECTION = asyncActions("FETCH_COLLECTION")
const FETCH_URL_METADATA = asyncActions("FETCH_URL_METADATA")
const SET_WANTED_URL = "SET_WANTED_URL"
const URL_ID_EXISTS = asyncActions("URL_ID_EXISTS")

export interface IUrlMetadata {
  statusCode?: number
  title?: string
}

export interface IUrl {
  href: string
  id?: string
  metadata?: IUrlMetadata
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
  itIsFetchingUrlMetadata: boolean
  wantedUrl: IUrl | null
  wantedUrlHrefIsValid: boolean | null
  wantedUrlIdExists: boolean | null
}

export const initialState: ICollectionsState = {
  current: null,
  itIsCheckingIfUrlIdExists: false,
  itIsCreatingUrl: false,
  itIsFetchingUrlMetadata: false,
  selected: "default",
  wantedUrl: null,
  wantedUrlHrefIsValid: null,
  wantedUrlIdExists: null,
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

    client.post("/url", { collectionId, url }, token).then(
      (data) => dispatch({ data, type: CREATE_URL.SUCCESS }),
      (error) => dispatch({ error: client.parseError(error), type: CREATE_URL.FAILURE }),
    )
  }
}

function fetchCollection(token, id) {
  return (dispatch, getState) => {
    dispatch({ type: FETCH_COLLECTION.REQUEST, id })

    client.get(`/url-collection/${id}`, token).then(
      (data) => dispatch({ data, type: FETCH_COLLECTION.SUCCESS }),
      (error) => dispatch({ error: client.parseError(error), type: FETCH_COLLECTION.FAILURE }),
    )
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
      account,
      wantedUrl,
    } = getState()

    const {
      token,
    } = account.authentication

    const urlHrefChanged = wantedUrl ? (wantedUrl.href !== url.href) : typeof url.href === "string"
    const urlHrefIsEmpty = url.href === ""

    const urlIdChanged = wantedUrl ? (wantedUrl.id !== url.id) : typeof url.id === "string"
    const urlIdIsEmpty = url.id === ""

    if (urlHrefChanged) {
      if (urlHrefIsEmpty) {
        dispatch({ data: { url, wantedUrlHrefIsValid: null }, type: SET_WANTED_URL })
      } else {
        const wantedUrlHrefIsValid = urlRegex.test(url.href)

        if (wantedUrlHrefIsValid) {
          dispatch({ type: FETCH_URL_METADATA.REQUEST })

          const encodedHref = encodeURIComponent(url.href)

          client.get(`/url-metadata?href=${encodedHref}`, token).then(
            (data) => dispatch({ data: { href: url.href, metadata: data }, type: FETCH_URL_METADATA.SUCCESS }),
            (error) => dispatch({ error: client.parseError(error), type: FETCH_URL_METADATA.FAILURE }),
          )
        } else {
          dispatch({ data: { url, wantedUrlHrefIsValid: false }, type: SET_WANTED_URL })
        }
      }
    }

    if (urlIdChanged) {
      if (urlIdIsEmpty) {
        dispatch({ data: url, type: SET_WANTED_URL })
      } else {
        dispatch({ type: URL_ID_EXISTS.REQUEST })

        client.get(`/url/${url.id}`, token).then(
          (data) => dispatch({ data: true, type: URL_ID_EXISTS.SUCCESS }),
            (error) => {
            const { code, message } = client.parseError(error)

            if (code === "UrlDoesNotExistError") {
              dispatch({ data: false, type: URL_ID_EXISTS.SUCCESS })
            } else {
              dispatch({ error: { code, message }, type: URL_ID_EXISTS.FAILURE })
            }
          }
        )
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
        wantedUrlIdExists: null,
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

    case FETCH_URL_METADATA.FAILURE:
      return {
        ...state,
        itIsFetchingUrlMetadata: false,
      }

    case FETCH_URL_METADATA.REQUEST:
      return {
        ...state,
        itIsFetchingUrlMetadata: true,
        wantedUrlHrefIsValid: true,
      }

    case FETCH_URL_METADATA.SUCCESS:
      return {
        ...state,
        itIsFetchingUrlMetadata: false,
        wantedUrl: {
          ...state.wantedUrl,
          href: action.data.href,
          metadata: action.data.metadata,
          title: action.data.metadata.title,
        }
      }

    case SET_WANTED_URL:
      return {
        ...state,
        wantedUrl: action.data.url,
        wantedUrlHrefIsValid: action.data.wantedUrlHrefIsValid,
        wantedUrlIdExists: action.data.id === "" ? null : state.wantedUrlIdExists,
      }

    case URL_ID_EXISTS.FAILURE:
      return {
        ...state,
        itIsCheckingIfUrlIdExists: false,
        wantedUrlIdExists: null,
      }

    case URL_ID_EXISTS.REQUEST:
      return {
        ...state,
        itIsCheckingIfUrlIdExists: true,
        wantedUrl: action.data,
        wantedUrlIdExists: null,
      }

    case URL_ID_EXISTS.SUCCESS:
      return {
        ...state,
        itIsCheckingIfUrlIdExists: false,
        wantedUrlIdExists: action.data,
      }

    default: return state
  }
}
