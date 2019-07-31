// User can organize its URLs into collections.
// Every collection has an identifier and a name.
// If no URL collection is selected there is always a "default" collection.
import * as urlRegex from "regex-weburl"

import asyncActions from "../asyncActions"
import * as client from "../client"

const CREATE_URL = asyncActions("CREATE_URL")
const REMOVE_URL_FROM_COLLECTION = asyncActions("REMOVE_URL_FROM_COLLECTION")
const FETCH_URL_COLLECTION = asyncActions("FETCH_URL_COLLECTION")
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

export interface IUrlCollection {
  id: string
  name: string
  urls: IUrl[]
}

export interface IUrlCollectionsState {
  checkingIfUrlIdExists: boolean
  creatingUrl: boolean
  currentUrlCollection: IUrlCollection | null
  fetchingUrlMetadata: boolean
  removingUrlId: string | null
  selectedUrlCollectionId: string | null
  wantedUrl: IUrl | null
  wantedUrlHrefIsValid: boolean | null
  wantedUrlIdExists: boolean | null
}

export const initialState: IUrlCollectionsState = {
  checkingIfUrlIdExists: false,
  creatingUrl: false,
  currentUrlCollection: null,
  fetchingUrlMetadata: false,
  removingUrlId: null,
  selectedUrlCollectionId: null,
  wantedUrl: null,
  wantedUrlHrefIsValid: null,
  wantedUrlIdExists: null,
}

export function createUrl(url: IUrl) {
  const { FAILURE, SUCCESS, REQUEST } = CREATE_URL

  return (dispatch, getState) => {
    const {
      account: {
        authentication: { token },
        id: accountId,
      },
      urlCollections: { selectedUrlCollectionId }
    } = getState()

    dispatch({ type: REQUEST })

    const urlCollectionId = fallbackToDefaultUrlCollectionId(selectedUrlCollectionId, accountId)

    client.post("/url", { urlCollectionId, url }, token).then(
      (data) => dispatch({ data, type: SUCCESS }),
      (error) => dispatch({ error: client.parseError(error), type: FAILURE }),
    )
  }
}

function fallbackToDefaultUrlCollectionId(selectedUrlCollectionId, accountId) {
  if (typeof selectedUrlCollectionId === "string") {
    return selectedUrlCollectionId
  } else {
    return accountId.replace(/^a-/, "c-")
  }
}

function fetchUrlCollection(token, id) {
  const { FAILURE, SUCCESS, REQUEST } = FETCH_URL_COLLECTION

  return (dispatch) => {
    dispatch({ type: REQUEST })

    client.get(`/url-collection/${id}`, token).then(
      (data) => dispatch({ data, type: SUCCESS }),
      (error) => dispatch({ error: client.parseError(error), type: FAILURE }),
    )
  }

}

export function fetchUrlCollectionIfNeeded() {
  return (dispatch, getState) => {
    const {
      account: {
        authentication: { token },
        id: accountId,
      },
      urlCollections: {
        currentUrlCollection,
        selectedUrlCollectionId,
      },
    } = getState()

    const urlCollectionId = fallbackToDefaultUrlCollectionId(selectedUrlCollectionId, accountId)

    if (shouldFetchUrlCollection(currentUrlCollection, urlCollectionId)) {
      return dispatch(fetchUrlCollection(token, selectedUrlCollectionId))
    }
  }
}

export function removeUrlFromCollection(urlCollectionId: string, urlId: string) {
  const { FAILURE, SUCCESS, REQUEST } = REMOVE_URL_FROM_COLLECTION

  return (dispatch, getState) => {
    const { account: { authentication: { token } } } = getState()

    dispatch({ data: { removingUrlId: urlId }, type: REQUEST })

    client.del(`/url-collection/${urlCollectionId}/${urlId}`, token).then(
      () => dispatch({ type: SUCCESS }),
      (error) => dispatch({ error: client.parseError(error), type: FAILURE }),
    )
  }
}

export function setWantedUrl(url: IUrl) {
  return (dispatch, getState) => {
    const {
      account: { authentication: { token } },
      wantedUrl,
    } = getState()

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
          () => dispatch({ data: true, type: URL_ID_EXISTS.SUCCESS }),
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

function shouldFetchUrlCollection(currentUrlCollection, selectedUrlCollectionId) {
  if (currentUrlCollection === null) {
    return true
  } else {
    return currentUrlCollection.id === selectedUrlCollectionId
  }
}

export default function(state = initialState, action) {
  switch (action.type) {
    case CREATE_URL.FAILURE:
      return {
        ...state,
        creatingUrl: false,
      }

    case CREATE_URL.REQUEST:
      return {
        ...state,
        creatingUrl: true,
        wantedUrlIdExists: null,
      }

    case CREATE_URL.SUCCESS:
      return {
        ...state,
        creatingUrl: false,
      }

    case REMOVE_URL_FROM_COLLECTION.FAILURE:
      return {
        ...state,
        removingUrlId: null,
      }

    case REMOVE_URL_FROM_COLLECTION.REQUEST:
      return {
        ...state,
        removingUrlId: action.data.removingUrlId,
      }

    case REMOVE_URL_FROM_COLLECTION.SUCCESS:
      return {
        ...state,
        removingUrlId: null,
      }

    case FETCH_URL_COLLECTION.FAILURE:
      return {
        ...state,
      }

    case FETCH_URL_COLLECTION.REQUEST:
      return {
        ...state,
      }

    case FETCH_URL_COLLECTION.SUCCESS:
      return {
        ...state,
        currentUrlCollection: action.data
      }

    case FETCH_URL_METADATA.FAILURE:
      return {
        ...state,
        fetchingUrlMetadata: false,
      }

    case FETCH_URL_METADATA.REQUEST:
      return {
        ...state,
        fetchingUrlMetadata: true,
        wantedUrlHrefIsValid: true,
      }

    case FETCH_URL_METADATA.SUCCESS:
      return {
        ...state,
        fetchingUrlMetadata: false,
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
        checkingIfUrlIdExists: false,
        wantedUrlIdExists: null,
      }

    case URL_ID_EXISTS.REQUEST:
      return {
        ...state,
        checkingIfUrlIdExists: true,
        wantedUrl: action.data,
        wantedUrlIdExists: null,
      }

    case URL_ID_EXISTS.SUCCESS:
      return {
        ...state,
        checkingIfUrlIdExists: false,
        wantedUrlIdExists: action.data,
      }

    default: return state
  }
}
