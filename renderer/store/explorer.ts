import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit'
import { Content } from 'interfaces'
import { AppState, AppThunk } from 'store'

type State = {
  contents: Content[]
  loading: boolean
  query: string
  selectedContents: Content[]
}

const initialState: State = {
  contents: [],
  loading: false,
  query: '',
  selectedContents: [],
}

export const explorerSlice = createSlice({
  name: 'explorer',
  initialState,
  reducers: {
    loaded(state, action: PayloadAction<Content[]>) {
      return { ...state, contents: action.payload, loading: false }
    },
    loading(state) {
      return { ...state, contents: [], loading: true }
    },
    select(state, action: PayloadAction<Content>) {
      return { ...state, selectedContents: [action.payload] }
    },
    setQuery(state, action: PayloadAction<string>) {
      return { ...state, query: action.payload }
    },
    unselectAll(state) {
      return { ...state, selectedContents: [] }
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

export const selectSelectedContents = createSelector(
  selectExplorer,
  (explorer) => explorer.selectedContents
)

export const selectIsContentSelected = createSelector(
  selectSelectedContents,
  (selectedContents) => (content: Content) =>
    selectedContents.findIndex(
      (selectedContent) => selectedContent.path === content.path
    ) > -1
)

export const load =
  (path: string): AppThunk =>
  async (dispatch) => {
    dispatch(loading())
    const contents = await window.electronAPI.listContents(path)
    dispatch(loaded(contents))
  }
