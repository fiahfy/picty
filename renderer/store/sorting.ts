import { useCallback, useReducer } from 'react'

type Option = {
  order: 'asc' | 'desc'
  orderBy: 'name' | 'rating' | 'dateModified'
}

type State = {
  [path: string]: Option
}

type Action =
  | { type: 'set'; payload: State }
  | {
      type: 'sort'
      payload: { path: string; option: Option }
    }

const initialState: State = {}

const reducer = (state: State, action: Action) => {
  const { type, payload } = action
  switch (type) {
    case 'set':
      return { ...state, ...payload }
    case 'sort': {
      const { path, option } = payload
      return {
        ...state,
        [path]: option,
      }
    }
    default:
      return state
  }
}

export const useStore = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const getOption = useCallback(
    (path: string) => state[path] ?? { order: 'asc', orderBy: 'name' },
    [state]
  )

  const setState = useCallback(
    (state: State) => dispatch({ type: 'set', payload: state }),
    []
  )
  const sort = useCallback(
    (path: string, option: Option) =>
      dispatch({ type: 'sort', payload: { path, option } }),
    [dispatch]
  )

  return { getOption, setState, sort, state }
}
