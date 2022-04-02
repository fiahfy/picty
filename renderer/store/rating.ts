import { Dispatch, useCallback } from 'react'
import { GlobalAction, GlobalState } from 'store'

export type State = {
  [path: string]: number
}

export type Action = {
  type: 'rating/rate'
  payload: { path: string; rating: number }
}

export const initialState: State = {}

export const reducer = (state: GlobalState, action: GlobalAction) => {
  const { type, payload } = action
  switch (type) {
    case 'rating/rate': {
      const { path, rating } = payload
      return {
        ...state,
        rating: {
          ...state.rating,
          [path]: rating,
        },
      }
    }
    default:
      return state
  }
}

export const useSelectorsAndOperations = (
  state: GlobalState,
  dispatch: Dispatch<GlobalAction>
) => {
  const isRating = (path: string) => state.rating[path] ?? 0
  const rate = useCallback(
    (path: string, rating: number) =>
      dispatch({ type: 'rating/rate', payload: { path, rating } }),
    [dispatch]
  )
  return { isRating, rate }
}
