import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit'
import { AppState } from 'store'

type State = {
  darkMode: boolean
  explorerLayout: 'list' | 'thumbnail'
  fullscreen: boolean
  sidebarHidden: boolean
  sidebarWidth: number
}

const initialState: State = {
  darkMode: false,
  explorerLayout: 'list',
  fullscreen: true,
  sidebarHidden: false,
  sidebarWidth: 256,
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setDarkMode(state, action: PayloadAction<boolean>) {
      return { ...state, darkMode: action.payload }
    },
    setExplorerLayout(state, action: PayloadAction<'list' | 'thumbnail'>) {
      return { ...state, explorerLayout: action.payload }
    },
    setFullscreen(state, action: PayloadAction<boolean>) {
      return { ...state, fullscreen: action.payload }
    },
    setSidebarHidden(state, action: PayloadAction<boolean>) {
      return { ...state, sidebarHidden: action.payload }
    },
    setSidebarWidth(state, action: PayloadAction<number>) {
      return { ...state, sidebarWidth: action.payload }
    },
  },
})

export const {
  setDarkMode,
  setExplorerLayout,
  setFullscreen,
  setSidebarHidden,
  setSidebarWidth,
} = settingsSlice.actions

export default settingsSlice.reducer

export const selectSettings = (state: AppState) => state.settings

export const selectDarkMode = createSelector(
  selectSettings,
  (settings) => settings.darkMode
)

export const selectExplorerLayout = createSelector(
  selectSettings,
  (settings) => settings.explorerLayout
)

export const selectFullscreen = createSelector(
  selectSettings,
  (settings) => settings.fullscreen
)

export const selectSidebarHidden = createSelector(
  selectSettings,
  (settings) => settings.sidebarHidden
)

export const selectSidebarWidth = createSelector(
  selectSettings,
  (settings) => settings.sidebarWidth
)
