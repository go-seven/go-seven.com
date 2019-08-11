import asyncActions from "../asyncActions"
import * as client from "../client"

const FETCH_URL_DAILY_HITS = asyncActions("FETCH_URL_DAILY_HITS")
const FETCH_URL_MONTHLY_HITS = asyncActions("FETCH_URL_MONTHLY_HITS")

export const initialState: IAnalyticsState = {
  urlsDailyHits: [],
  urlsMonthlyHits: [],
}

interface IAnalyticsState {
  urlsDailyHits: IUrlDailyHits[]
  urlsMonthlyHits: IUrlMonthlyHits[]
}

export interface IUrlDailyHits {
  id: string
  day: string
  num: number
}

export interface IUrlMonthlyHits {
  id: string
  month: string
  num: number
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

function fetchUrlMonthlyHits(token, id, month) {
  const { FAILURE, SUCCESS, REQUEST } = FETCH_URL_MONTHLY_HITS

  return (dispatch) => {
    dispatch({ type: REQUEST })

    client.get(`/url-monthly-hits/${id}/${month}`, token).then(
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

export function fetchUrlMonthlyHitsIfNeeded(id, month) {
  return (dispatch, getState) => {
    const {
      account: { authentication: { token } },
      analytics: { urlsMonthlyHits },
    } = getState()

    if (shouldFetchUrlMonthlyHits(urlsMonthlyHits, id, month)) {
      return dispatch(fetchUrlMonthlyHits(token, id, month))
    }
  }
}

function shouldFetchUrlDailyHits(urlsDailyHits, urlId, wantedDay) {
  return !urlsDailyHits.find(({ id, day }) => `${id}${day}` === `${urlId}${wantedDay}`)
}

function shouldFetchUrlMonthlyHits(urlsMonthlyHits, urlId, wantedMonth) {
  return !urlsMonthlyHits.find(({ id, month }) => `${id}${month}` === `${urlId}${wantedMonth}`)
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

    case FETCH_URL_MONTHLY_HITS.FAILURE:
      return {
        ...state,
      }

    case FETCH_URL_MONTHLY_HITS.REQUEST:
      return {
        ...state,
      }

    case FETCH_URL_MONTHLY_HITS.SUCCESS:
      return {
        ...state,
        urlsMonthlyHits: state.urlsMonthlyHits.filter(({ id }) => id !== action.data.id).concat(action.data)
      }

    default: return state
  }
}
