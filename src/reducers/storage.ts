interface IUrl {
  href: string
  title?: string
}

interface IStorageState {

}

export function createUrl() {

}

export const initialState: IStorageState = {
}

export default function(state = initialState, action) {
  switch (action.type) {
    default: return state
  }
}
