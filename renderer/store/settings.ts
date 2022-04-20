import { useCallback, useMemo, useReducer } from 'react'

type State = {
  darkMode: boolean
  drawerHidden: boolean
  drawerWidth: number
  explorerLayout: 'list' | 'thumbnail'
  fullscreenOnPresentation: boolean
}

type Action = { type: 'set'; payload: Partial<State> }

const initialState: State = {
  darkMode: false,
  drawerHidden: false,
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
  const drawerHidden = useMemo(() => state.drawerHidden, [state.drawerHidden])
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
  const setDrawerHidden = useCallback(
    (drawerHidden: boolean) =>
      dispatch({ type: 'set', payload: { drawerHidden } }),
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
    drawerHidden,
    drawerWidth,
    explorerLayout,
    fullscreenOnPresentation,
    setDarkMode,
    setDrawerHidden,
    setDrawerWidth,
    setExplorerLayout,
    setFullscreenOnPresentation,
    setState,
    state,
  }
}
