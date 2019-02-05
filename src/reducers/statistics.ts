// Statistics are given by a set of reports.
// A report is given by a collection and a time period.
// The default report shows the default collection, i.e. all URLs, and all historic data available.

interface IStatisticsState {
}

export const initialState: IStatisticsState = {
}

export default function(state = initialState, action) {
  switch (action.type) {
    default: return state
  }
}
