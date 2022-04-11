import { Content } from 'interfaces'
import { useCallback, useMemo, useReducer } from 'react'

type State = {
  contents: Content[]
  loading: boolean
  query: string
  selected: string[]
}

type Action = { type: 'set'; payload: Partial<State> }

const initialState: State = {
  contents: [],
  loading: false,
  query: '',
  selected: [],
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

  const contents = useMemo(() => state.contents, [state.contents])
  const loading = useMemo(() => state.loading, [state.loading])
  const query = useMemo(() => state.query, [state.query])
  const selected = useMemo(() => state.selected, [state.selected])

  const setState = useCallback(
    (state: Partial<State>) => dispatch({ type: 'set', payload: state }),
    []
  )
  const setContents = useCallback(
    (contents: Content[]) => dispatch({ type: 'set', payload: { contents } }),
    [dispatch]
  )
  const setLoading = useCallback(
    (loading: boolean) => dispatch({ type: 'set', payload: { loading } }),
    [dispatch]
  )
  const setQuery = useCallback(
    (query: string) => dispatch({ type: 'set', payload: { query } }),
    [dispatch]
  )
  const setSelected = useCallback(
    (selected: string[]) => dispatch({ type: 'set', payload: { selected } }),
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
    setState,
    state,
  }
}
