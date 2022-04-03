import { useCallback, useReducer } from 'react'

type State = {
  [path: string]: number
}

type Action =
  | { type: 'set'; payload: Partial<State> }
  | {
      type: 'setRating'
      payload: { path: string; rating: number }
    }

const initialState: State = {}

const reducer = (state: State, action: Action) => {
  const { type, payload } = action
  switch (type) {
    case 'setRating': {
      const { path, rating } = payload
      return {
        ...state,
        [path]: rating,
      }
    }
    default:
      return state
  }
}

export const useStore = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const getRating = useCallback((path: string) => state[path] ?? 0, [state])

  const setState = useCallback(
    (state: Partial<State>) => dispatch({ type: 'set', payload: state }),
    []
  )
  const setRating = useCallback(
    (path: string, rating: number) =>
      dispatch({ type: 'setRating', payload: { path, rating } }),
    [dispatch]
  )

  return { getRating, setRating, setState, state }
}
