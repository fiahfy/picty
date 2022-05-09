import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { Content } from 'interfaces'
import { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from 'store'

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
    set(state, action: PayloadAction<Partial<State>>) {
      return { ...state, ...action.payload }
    },
  },
})

export const actions = explorerSlice.actions

export default explorerSlice.reducer

export const useExplorer = () => {
  const state = useAppSelector((state) => state.explorer)
  const dispatch = useAppDispatch()

  const contents = useMemo(() => state.contents, [state.contents])
  const loading = useMemo(() => state.loading, [state.loading])
  const query = useMemo(() => state.query, [state.query])
  const selected = useMemo(() => state.selected, [state.selected])

  const setContents = useCallback(
    (contents: Content[]) => dispatch(actions.set({ contents })),
    [dispatch]
  )
  const setLoading = useCallback(
    (loading: boolean) => dispatch(actions.set({ loading })),
    [dispatch]
  )
  const setQuery = useCallback(
    (query: string) => dispatch(actions.set({ query })),
    [dispatch]
  )
  const setSelected = useCallback(
    (selected: string[]) => dispatch(actions.set({ selected })),
    [dispatch]
  )

  return {
    contents,
    loading,
    query,
    selected,
    setContents,
    setLoading,
    setQuery,
    setSelected,
    state,
  }
}
