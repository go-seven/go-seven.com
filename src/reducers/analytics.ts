import asyncActions from "../asyncActions"
import * as client from "../client"

const FETCH_URL_DAILY_HITS = asyncActions("FETCH_URL_DAILY_HITS")
const FETCH_URL_TOTAL_HITS = asyncActions("FETCH_URL_TOTAL_HITS")

export const initialState: IAnalyticsState = {
  urlsDailyHits: [],
  urlsTotalHits: [],
}

interface IAnalyticsState {
  urlsDailyHits: IUrlDailyHits[]
  urlsTotalHits: IUrlTotalHits[]
}

interface IUrlDailyHits {
  id: string
  day: string
  num: number
}

export interface IUrlTotalHits {
  id: string
  tot: number
}

function fetchUrlDailyHits(token, id, day) {
  const { FAILURE, SUCCESS, REQUEST } = FETCH_URL_DAILY_HITS

  return (dispatch) => {
    dispatch({ type: REQUEST })

    client.get(`/url-daily-hits/${id}/${day}`, token).then(
      (data) => dispatch({ data, type: SUCCESS }),
      (error) => dispatch({ error: client.parseError(error), type: FAILURE }),
    )
  }
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

export function fetchUrlDailyHitsIfNeeded(id, day) {
  return (dispatch, getState) => {
    const {
      account: { authentication: { token } },
      analytics: { urlsDailyHits },
    } = getState()

    if (shouldFetchUrlDailyHits(urlsDailyHits, id, day)) {
      return dispatch(fetchUrlDailyHits(token, id, day))
    }
  }
}

export function fetchUrlTotalHitsIfNeeded(id) {
  return (dispatch, getState) => {
    const {
      account: { authentication: { token } },
      analytics: { urlsTotalHits },
    } = getState()

    if (shouldFetchUrlTotalHits(urlsTotalHits, id)) {
      return dispatch(fetchUrlTotalHits(token, id))
    }
  }
}

function shouldFetchUrlDailyHits(urlsDailyHits, urlId, wantedDay) {
  return !urlsDailyHits.find(({ id, day }) => `${id}${day}` === `${urlId}${wantedDay}`)
}

function shouldFetchUrlTotalHits(urlsTotalHits, urlId) {
  return !urlsTotalHits.find(({ id }) => id === urlId)
}
export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_URL_DAILY_HITS.FAILURE:
      return {
        ...state,
      }

    case FETCH_URL_DAILY_HITS.REQUEST:
      return {
        ...state,
      }

    case FETCH_URL_DAILY_HITS.SUCCESS:
      return {
        ...state,
        urlsDailyHits: state.urlsDailyHits.filter(({ id, day }) => `${id}${day}` !== `${action.data.id}${action.data.day}`).concat(action.data)
      }

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
        urlsTotalHits: state.urlsTotalHits.filter(({ id }) => id !== action.data.id).concat(action.data)
      }

    default: return state
  }
}
