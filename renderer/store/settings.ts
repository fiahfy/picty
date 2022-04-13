import { useCallback, useMemo, useReducer } from 'react'

type State = {
  darkMode: boolean
  explorerLayout: 'list' | 'thumbnail'
  fullscreenOnPresentation: boolean
}

type Action = { type: 'set'; payload: Partial<State> }

const initialState: State = {
  darkMode: false,
  explorerLayout: 'list',
  fullscreenOnPresentation: false,
}

const reducer = (state: State, action: Action) => {
  const { type, payload } = action
  switch (type) {
    case 'set':
      return { ...state, ...payload }
    default:
      return state
  }
}

export const useStore = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const darkMode = useMemo(() => state.darkMode, [state.darkMode])
  const explorerLayout = useMemo(
    () => state.explorerLayout,
    [state.explorerLayout]
  )
  const fullscreenOnPresentation = useMemo(
    () => state.fullscreenOnPresentation,
    [state.fullscreenOnPresentation]
  )

  const setState = useCallback(
    (state: Partial<State>) => dispatch({ type: 'set', payload: state }),
    []
  )
  const setDarkMode = useCallback(
    (darkMode: boolean) => dispatch({ type: 'set', payload: { darkMode } }),
    [dispatch]
  )
  const setExplorerLayout = useCallback(
    (explorerLayout: 'list' | 'thumbnail') =>
      dispatch({ type: 'set', payload: { explorerLayout } }),
    [dispatch]
  )
  const setFullscreenOnPresentation = useCallback(
    (fullscreenOnPresentation: boolean) =>
      dispatch({ type: 'set', payload: { fullscreenOnPresentation } }),
    [dispatch]
  )

  return {
    darkMode,
    explorerLayout,
    fullscreenOnPresentation,
    setDarkMode,
    setExplorerLayout,
    setFullscreenOnPresentation,
    setState,
    state,
  }
}
