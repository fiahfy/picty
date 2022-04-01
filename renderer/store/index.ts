import { useCallback, useReducer } from 'react'
import * as explorer from 'store/explorer'
import * as history from 'store/history'
import * as settings from 'store/settings'

export type Store = {
  explorer: ReturnType<typeof explorer.selectors> &
    ReturnType<typeof explorer.operations>
  history: ReturnType<typeof history.selectors> &
    ReturnType<typeof history.operations>
  settings: ReturnType<typeof settings.selectors> &
    ReturnType<typeof settings.operations>
  setState: (state: GlobalState) => void
  state: GlobalState
}

export type GlobalState = {
  explorer: explorer.State
  history: history.State
  settings: settings.State
}

export type GlobalAction =
  | explorer.Action
  | history.Action
  | settings.Action
  | { type: 'set'; payload: GlobalState }

const initialState = {
  explorer: explorer.initialState,
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
      return settings.reducer(
        history.reducer(explorer.reducer(state, action), action),
        action
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
    explorer: {
      ...explorer.selectors(state),
      ...explorer.operations(dispatch),
    },
    history: { ...history.selectors(state), ...history.operations(dispatch) },
    settings: {
      ...settings.selectors(state),
      ...settings.operations(dispatch),
    },
    setState,
    state,
  }

  return store
}
