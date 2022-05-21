import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit'
import { AppState } from 'store'

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
    setDarkMode(state, action: PayloadAction<boolean>) {
      return { ...state, darkMode: action.payload }
    },
    setDrawerHidden(state, action: PayloadAction<boolean>) {
      return { ...state, drawerHidden: action.payload }
    },
    setDrawerWidth(state, action: PayloadAction<number>) {
      return { ...state, drawerWidth: action.payload }
    },
    setExplorerLayout(state, action: PayloadAction<'list' | 'thumbnail'>) {
      return { ...state, explorerLayout: action.payload }
    },
  },
})

export const {
  setDarkMode,
  setDrawerHidden,
  setDrawerWidth,
  setExplorerLayout,
} = settingsSlice.actions

export default settingsSlice.reducer

export const selectSettings = (state: AppState) => state.settings

export const selectDarkMode = createSelector(
  selectSettings,
  (settings) => settings.darkMode
)

export const selectDrawerHidden = createSelector(
  selectSettings,
  (settings) => settings.drawerHidden
)

export const selectDrawerWidth = createSelector(
  selectSettings,
  (settings) => settings.drawerWidth
)

export const selectExplorerLayout = createSelector(
  selectSettings,
  (settings) => settings.explorerLayout
)
