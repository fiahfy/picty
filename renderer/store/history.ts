import { Dispatch } from 'react'
import { GlobalAction, GlobalState } from 'store'

export type State = {
  directories: string[]
  index: number
}

export type Action =
  | { type: 'history/go'; payload: number }
  | { type: 'history/push'; payload: string }

export const initialState: State = {
  directories: [],
  index: -1,
}

export const reducer = (state: GlobalState, action: GlobalAction) => {
  const { type, payload } = action
  switch (type) {
    case 'history/go': {
      const index = state.history.index + payload
      const directory = state.history.directories[index]
      return directory
        ? {
            ...state,
            history: {
              ...state.history,
              index,
            },
          }
        : state
    }
    case 'history/push': {
      const index = state.history.index + 1
      return {
        ...state,
        history: {
          directories: [...state.history.directories.slice(0, index), payload],
          index,
        },
      }
    }
    default:
      return state
  }
}

export const createSelectorsAndOperations = (
  state: GlobalState,
  dispatch: Dispatch<GlobalAction>
) => {
  const canBack = state.history.index > 0
  const canForward = state.history.index < state.history.directories.length - 1
  const directory = state.history.directories[state.history.index]
  const push = (dir: string) => {
    if (dir !== directory) {
      dispatch({ type: 'history/push', payload: dir })
    }
  }
  const go = (offset: number) =>
    dispatch({ type: 'history/go', payload: offset })
  const back = () => go(-1)
  const forward = () => go(1)
  return { back, canBack, canForward, directory, forward, go, push }
}
