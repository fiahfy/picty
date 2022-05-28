import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit'
import { Content } from 'interfaces'
import { AppState, AppThunk } from 'store'

type State = {
  contents: Content[]
  loading: boolean
  query: string
  selected: string[]
}

const initialState: State = {
  contents: [],
  loading: false,
  query: '',
  selected: [],
}

export const explorerSlice = createSlice({
  name: 'explorer',
  initialState,
  reducers: {
    loaded(state, action: PayloadAction<Content[]>) {
      return { ...state, contents: action.payload, loading: false, query: '' }
    },
    loading(state) {
      return { ...state, contents: [], loading: true }
    },
    select(state, action: PayloadAction<string>) {
      return { ...state, selected: [action.payload] }
    },
    setQuery(state, action: PayloadAction<string>) {
      return { ...state, query: action.payload }
    },
    unselectAll(state) {
      return { ...state, selected: [] }
    },
  },
})

export const { loaded, loading, select, setQuery, unselectAll } =
  explorerSlice.actions

export default explorerSlice.reducer

export const selectExplorer = (state: AppState) => state.explorer

export const selectContents = createSelector(
  selectExplorer,
  (explorer) => explorer.contents
)

export const selectLoading = createSelector(
  selectExplorer,
  (explorer) => explorer.loading
)

export const selectQuery = createSelector(
  selectExplorer,
  (explorer) => explorer.query
)

export const selectIsSelected = createSelector(
  selectExplorer,
  (explorer) => (path: string) => explorer.selected.includes(path)
)

export const selectSelectedContents = createSelector(
  selectExplorer,
  selectIsSelected,
  (explorer, isSelected) =>
    explorer.contents.filter((content) => isSelected(content.path))
)

export const load =
  (path: string): AppThunk =>
  async (dispatch) => {
    dispatch(loading())
    try {
      const contents = await window.electronAPI.listContents(path)
      dispatch(loaded(contents))
    } catch (e) {
      dispatch(loaded([]))
    }
  }
