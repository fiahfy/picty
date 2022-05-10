import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from 'store'

type State = {
  darkMode: boolean
  drawerHidden: boolean
  drawerWidth: number
  explorerLayout: 'list' | 'thumbnail'
}

const initialState: State = {
  darkMode: false,
  drawerHidden: false,
  drawerWidth: 256,
  explorerLayout: 'list',
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    set(state, action: PayloadAction<Partial<State>>) {
      return { ...state, ...action.payload }
    },
  },
})

export const actions = settingsSlice.actions

export default settingsSlice.reducer

export const useSettings = () => {
  const state = useAppSelector((state) => state.settings)
  const dispatch = useAppDispatch()

  const darkMode = useMemo(() => state.darkMode, [state.darkMode])
  const drawerHidden = useMemo(() => state.drawerHidden, [state.drawerHidden])
  const drawerWidth = useMemo(() => state.drawerWidth, [state.drawerWidth])
  const explorerLayout = useMemo(
    () => state.explorerLayout,
    [state.explorerLayout]
  )

  const setDarkMode = useCallback(
    (darkMode: boolean) => dispatch(actions.set({ darkMode })),
    [dispatch]
  )
  const setDrawerHidden = useCallback(
    (drawerHidden: boolean) => dispatch(actions.set({ drawerHidden })),
    [dispatch]
  )
  const setDrawerWidth = useCallback(
    (drawerWidth: number) => dispatch(actions.set({ drawerWidth })),
    [dispatch]
  )
  const setExplorerLayout = useCallback(
    (explorerLayout: 'list' | 'thumbnail') =>
      dispatch(actions.set({ explorerLayout })),
    [dispatch]
  )

  return {
    darkMode,
    drawerHidden,
    drawerWidth,
    explorerLayout,
    setDarkMode,
    setDrawerHidden,
    setDrawerWidth,
    setExplorerLayout,
    state,
  }
}
