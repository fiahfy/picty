import { Dispatch } from 'react'
import { GlobalAction, GlobalState } from 'utils/PersistedStateContext'

export type State = {
  directories: string[]
  index: number
}

export type Action = { type: 'history/push'; payload: string }

export const initialState: State = {
  directories: [],
  index: -1,
}

export const reducer = (state: GlobalState, action: GlobalAction) => {
  const { type, payload } = action
  switch (type) {
    case 'history/push':
      return {
        ...state,
        history: {
          directories: [
            ...state.history.directories.slice(0, state.history.index),
            payload,
          ],
          index: state.history.index + 1,
        },
      }
    default:
      return state
  }
}

export const selectors = (state: GlobalState) => {
  const canBack = state.history.index > 0
  return { canBack }
}

export const operations = (dispatch: Dispatch<Action>) => {
  const push = (directory: string) =>
    dispatch({ type: 'history/push', payload: directory })
  return { push }
}
