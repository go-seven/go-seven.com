import no from 'not-defined'

import {
  IUrlDailyHits,
  IUrlMonthlyHits,
} from '../model'

import api from '../api'
import asyncActions from '../asyncActions'

const FETCH_URL_DAILY_HITS = asyncActions('FETCH_URL_DAILY_HITS')
const FETCH_URL_MONTHLY_HITS = asyncActions('FETCH_URL_MONTHLY_HITS')

export const initialState: IAnalyticsState = {
  urlsDailyHits: [],
  urlsMonthlyHits: []
}

interface IAnalyticsState {
  urlsDailyHits: IUrlDailyHits[]
  urlsMonthlyHits: IUrlMonthlyHits[]
}

function fetchUrlDailyHits (token, id, day) {
  const { FAILURE, SUCCESS, REQUEST } = FETCH_URL_DAILY_HITS

  return (dispatch) => {
    dispatch({ type: REQUEST })

    api(token).urlDailyHits({ param: { id, day } }).then(
      (data) => dispatch({ data, type: SUCCESS }),
      (error) => dispatch({ error, type: FAILURE })
    )
  }
}

function fetchUrlMonthlyHits (token, id, month) {
  const { FAILURE, SUCCESS, REQUEST } = FETCH_URL_MONTHLY_HITS

  return (dispatch) => {
    dispatch({ type: REQUEST })

    api(token).urlMonthlyHits({ param: { id, month } }).then(
      (data) => dispatch({ data, type: SUCCESS }),
      (error) => dispatch({ error, type: FAILURE })
    )
  }
}

export function fetchUrlDailyHitsIfNeeded (id, day) {
  return (dispatch, getState) => {
    const {
      account: { authentication: { token } },
      analytics: { urlsDailyHits }
    } = getState()

    if (shouldFetchUrlDailyHits(urlsDailyHits, id, day)) {
      return dispatch(fetchUrlDailyHits(token, id, day))
    }
  }
}

export function fetchUrlMonthlyHitsIfNeeded (id, month) {
  return (dispatch, getState) => {
    const {
      account: { authentication: { token } },
      analytics: { urlsMonthlyHits }
    } = getState()

    if (shouldFetchUrlMonthlyHits(urlsMonthlyHits, id, month)) {
      return dispatch(fetchUrlMonthlyHits(token, id, month))
    }
  }
}

function shouldFetchUrlDailyHits (urlsDailyHits, urlId, wantedDay) {
  return !urlsDailyHits.find(({ id, day }) => `${id}${day}` === `${urlId}${wantedDay}`)
}

function shouldFetchUrlMonthlyHits (urlsMonthlyHits, urlId, wantedMonth) {
  return !urlsMonthlyHits.find(({ id, month }) => `${id}${month}` === `${urlId}${wantedMonth}`)
}

export default function (state, action) {
  if (no(state)) return initialState

  switch (action.type) {
    case FETCH_URL_DAILY_HITS.FAILURE:
      return {
        ...state
      }

    case FETCH_URL_DAILY_HITS.REQUEST:
      return {
        ...state
      }

    case FETCH_URL_DAILY_HITS.SUCCESS:
      return {
        ...state,
        urlsDailyHits: state.urlsDailyHits.filter(
          ({ id, day }) => id === action.data.id ? day !== action.data.day : true
        ).concat(action.data)
      }

    case FETCH_URL_MONTHLY_HITS.FAILURE:
      return {
        ...state
      }

    case FETCH_URL_MONTHLY_HITS.REQUEST:
      return {
        ...state
      }

    case FETCH_URL_MONTHLY_HITS.SUCCESS:
      return {
        ...state,
        urlsMonthlyHits: state.urlsMonthlyHits.filter(({ id }) => id !== action.data.id).concat(action.data)
      }

    default: return state
  }
}
