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

// const actions = explorerSlice.actions

// export const useExplorer = () => {
//   const state = useAppSelector((state) => state.explorer)
//   const dispatch = useAppDispatch()

//   const contents = useMemo(() => state.contents, [state.contents])
//   const loading = useMemo(() => state.loading, [state.loading])
//   const query = useMemo(() => state.query, [state.query])
//   const selected = useMemo(() => state.selected, [state.selected])

//   const isSelected = useCallback(
//     (content: Content) =>
//       state.selected.findIndex((selected) => selected.path === content.path) >
//       -1,
//     [state.selected]
//   )

//   const setContents = useCallback(
//     (contents: Content[]) => dispatch(actions.set({ contents })),
//     [dispatch]
//   )
//   const setLoading = useCallback(
//     (loading: boolean) => dispatch(actions.set({ loading })),
//     [dispatch]
//   )
//   const setQuery = useCallback(
//     (query: string) => dispatch(actions.set({ query })),
//     [dispatch]
//   )
//   const setSelected = useCallback(
//     (selected: Content[]) => dispatch(actions.set({ selected })),
//     [dispatch]
//   )

//   return {
//     contents,
//     isSelected,
//     loading,
//     query,
//     selected,
//     setContents,
//     setLoading,
//     setQuery,
//     setSelected,
//     state,
//   }
// }
