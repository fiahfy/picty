import { useCallback, useMemo, useReducer } from 'react'

type State = {
  [path: string]: boolean
}

type Action =
  | { type: 'set'; payload: State }
  | {
      type: 'add'
      payload: { path: string }
    }
  | {
      type: 'remove'
      payload: { path: string }
    }

const initialState: State = {}

const reducer = (state: State, action: Action) => {
  const { type, payload } = action
  switch (type) {
    case 'set':
      return { ...state, ...payload }
    case 'add': {
      const { path } = payload
      return {
        ...state,
        [path]: true,
      }
    }
    case 'remove': {
      const { path } = payload
      const newState = { ...state }
      delete newState[path]
      return newState
    }
    default:
      return state
  }
}

export const useStore = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const list = useMemo(
    () =>
      Object.keys(state).reduce(
        (carry, path) => [...carry, path],
        [] as string[]
      ),
    [state]
  )

  const isFavorited = useCallback(
    (path: string) => state[path] ?? false,
    [state]
  )

  const setState = useCallback(
    (state: State) => dispatch({ type: 'set', payload: state }),
    []
  )
  const add = useCallback(
    (path: string) => dispatch({ type: 'add', payload: { path } }),
    [dispatch]
  )
  const remove = useCallback(
    (path: string) => dispatch({ type: 'remove', payload: { path } }),
    [dispatch]
  )
  const toggle = useCallback(
    (path: string) => (isFavorited(path) ? remove(path) : add(path)),
    [add, isFavorited, remove]
  )

  return { add, isFavorited, list, remove, setState, state, toggle }
}
