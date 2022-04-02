import { useCallback, useReducer } from 'react'
import * as history from 'store/history'
import * as rating from 'store/rating'
import * as settings from 'store/settings'

export type Store = {
  history: ReturnType<typeof history.useSelectorsAndOperations>
  rating: ReturnType<typeof rating.useSelectorsAndOperations>
  settings: ReturnType<typeof settings.useSelectorsAndOperations>
  setState: (state: GlobalState) => void
  state: GlobalState
}

export type GlobalState = {
  history: history.State
  rating: rating.State
  settings: settings.State
}

export type GlobalAction =
  | history.Action
  | rating.Action
  | settings.Action
  | { type: 'set'; payload: GlobalState }

const initialState = {
  history: history.initialState,
  rating: rating.initialState,
  settings: settings.initialState,
}

const rootReducer = (state: GlobalState, action: GlobalAction) => {
  const { type, payload } = action
  switch (type) {
    case 'set':
      // TODO: deep merge
      return { ...state, ...payload }
    default:
      return [history.reducer, rating.reducer, settings.reducer].reduce(
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
    history: { ...history.useSelectorsAndOperations(state, dispatch) },
    rating: { ...rating.useSelectorsAndOperations(state, dispatch) },
    settings: {
      ...settings.useSelectorsAndOperations(state, dispatch),
    },
    setState,
    state,
  }

  return store
}
