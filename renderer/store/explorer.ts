import { Dispatch } from 'react'
import { GlobalAction, GlobalState } from 'store'

export type State = {
  directory: string
}

export type Action = { type: 'explorer/set'; payload: Partial<State> }

export const initialState: State = {
  directory: '',
}

export const reducer = (state: GlobalState, action: GlobalAction) => {
  const { type, payload } = action
  switch (type) {
    case 'explorer/set':
      return { ...state, explorer: { ...state.explorer, ...payload } }
    default:
      return state
  }
}

export const selectors = (state: GlobalState) => {
  const directory = state.explorer.directory
  return { directory }
}

export const operations = (dispatch: Dispatch<Action>) => {
  const setDirectory = (directory: string) =>
    dispatch({ type: 'explorer/set', payload: { directory } })
  return { setDirectory }
}
