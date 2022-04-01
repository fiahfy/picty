import { useCallback, useReducer } from 'react'
import * as history from 'store/history'
import * as settings from 'store/settings'

export type Store = {
  history: ReturnType<typeof history.createSelectorsAndOperations>
  settings: ReturnType<typeof settings.createSelectorsAndOperations>
  setState: (state: GlobalState) => void
  state: GlobalState
}

export type GlobalState = {
  history: history.State
  settings: settings.State
}

export type GlobalAction =
  | history.Action
  | settings.Action
  | { type: 'set'; payload: GlobalState }

const initialState = {
  history: history.initialState,
  settings: settings.initialState,
}

const rootReducer = (state: GlobalState, action: GlobalAction) => {
  const { type, payload } = action
  switch (type) {
    case 'set':
      // TODO: deep merge
      return { ...state, ...payload }
    default:
      return [history.reducer, settings.reducer].reduce(
        (state, reducer) => reducer(state, action),
        state
      )
  }
}

export const useStore = () => {
  const [state, dispatch] = useReducer(rootReducer, initialState)

  const setState = useCallback(
    (state: GlobalState) => dispatch({ type: 'set', payload: state }),
    []
  )

  const store = {
    history: { ...history.createSelectorsAndOperations(state, dispatch) },
    settings: {
      ...settings.createSelectorsAndOperations(state, dispatch),
    },
    setState,
    state,
  }

  return store
}
