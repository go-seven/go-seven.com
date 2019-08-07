import asyncActions from "../asyncActions"
import * as client from "../client"

const FETCH_URL_TOTAL_HITS = asyncActions("FETCH_URL_TOTAL_HITS")

export const initialState: IAnalyticsState = {
  urlHitsByDay: [],
  urlTotalHits: [],
}

interface IAnalyticsState {
  urlHitsByDay: IUrlHitsByDay[]
  urlTotalHits: IUrlTotalHits[]
}

interface IUrlDailyHits {
  day: string
  num: number
}

export interface IUrlTotalHits {
  id: string
  tot: number
}

interface IUrlHitsByDay {
  id: string
  hits: IUrlDailyHits[]
}

function fetchUrlTotalHits(token, id) {
  const { FAILURE, SUCCESS, REQUEST } = FETCH_URL_TOTAL_HITS

  return (dispatch) => {
    dispatch({ type: REQUEST })

    client.get(`/url-total-hits/${id}`, token).then(
      (data) => dispatch({ data, type: SUCCESS }),
      (error) => dispatch({ error: client.parseError(error), type: FAILURE }),
    )
  }
}

export function fetchUrlTotalHitsIfNeeded(id) {
  return (dispatch, getState) => {
    const {
      account: { authentication: { token } },
      analytics: { urlTotalHits },
    } = getState()

    if (shouldFetchUrlTotalHits(urlTotalHits, id)) {
      return dispatch(fetchUrlTotalHits(token, id))
    }
  }
}

function shouldFetchUrlTotalHits(urlTotalHits, urlId) {
  return !urlTotalHits.find(({ id }) => id === urlId)
}

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_URL_TOTAL_HITS.FAILURE:
      return {
        ...state,
      }

    case FETCH_URL_TOTAL_HITS.REQUEST:
      return {
        ...state,
      }

    case FETCH_URL_TOTAL_HITS.SUCCESS:
      return {
        ...state,
        urlTotalHits: state.urlTotalHits.filter(({ id }) => id !== action.data.id).concat(action.data)
      }

    default: return state
  }
}
