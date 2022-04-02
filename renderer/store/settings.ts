import { Dispatch, useCallback } from 'react'
import { GlobalAction, GlobalState } from 'store'

export type State = {
  darkMode: boolean
}

export type Action = { type: 'settings/set'; payload: Partial<State> }

export const initialState: State = {
  darkMode: false,
}

export const reducer = (state: GlobalState, action: GlobalAction) => {
  const { type, payload } = action
  switch (type) {
    case 'settings/set':
      return { ...state, settings: { ...state.settings, ...payload } }
    default:
      return state
  }
}

export const useSelectorsAndOperations = (
  state: GlobalState,
  dispatch: Dispatch<GlobalAction>
) => {
  const darkMode = state.settings.darkMode
  const setDarkMode = useCallback(
    (darkMode: boolean) =>
      dispatch({ type: 'settings/set', payload: { darkMode } }),
    [dispatch]
  )
  return { darkMode, setDarkMode }
}
