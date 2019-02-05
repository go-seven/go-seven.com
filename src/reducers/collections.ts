// A Collection is a set of URLs. Every collection has an identifier and a name.
// User can organize its URLs into collections.
// If no collection is selected there is always a "default" collection which includes all URLs.

interface ICollection {
  id: string
  name: string
}

interface ICollectionsState {
  fetched: ICollection[]
  identifiers: string[]
  selected: string[]
}

export const initialState: ICollectionsState = {
  fetched: [],
  identifiers: [],
  selected: [],
}

export default function(state = initialState, action) {
  switch (action.type) {
    default: return state
  }
}
