import { useCallback, useMemo, useReducer } from 'react'

type State = {
  darkMode: boolean
  drawerWidth: number
  explorerLayout: 'list' | 'thumbnail'
  fullscreenOnPresentation: boolean
}

type Action = { type: 'set'; payload: Partial<State> }

const initialState: State = {
  darkMode: false,
  drawerWidth: 256,
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
  const drawerWidth = useMemo(() => state.drawerWidth, [state.drawerWidth])
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
  const setDrawerWidth = useCallback(
    (drawerWidth: number) =>
      dispatch({ type: 'set', payload: { drawerWidth } }),
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
    drawerWidth,
    explorerLayout,
    fullscreenOnPresentation,
    setDarkMode,
    setDrawerWidth,
    setExplorerLayout,
    setFullscreenOnPresentation,
    setState,
    state,
  }
}
