import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from 'store'

type State = {
  [path: string]: boolean
}

const initialState: State = {}

export const favoriteSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {
    add(state, action: PayloadAction<string>) {
      return {
        ...state,
        [action.payload]: true,
      }
    },
    remove(state, action: PayloadAction<string>) {
      const newState = { ...state }
      delete newState[action.payload]
      return newState
    },
  },
})

export const actions = favoriteSlice.actions

export default favoriteSlice.reducer

export const useFavorite = () => {
  const state = useAppSelector((state) => state.favorite)
  const dispatch = useAppDispatch()

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

  const add = useCallback(
    (path: string) => dispatch(actions.add(path)),
    [dispatch]
  )
  const remove = useCallback(
    (path: string) => dispatch(actions.remove(path)),
    [dispatch]
  )
  const toggle = useCallback(
    (path: string) => (isFavorited(path) ? remove(path) : add(path)),
    [add, isFavorited, remove]
  )

  return { add, isFavorited, list, remove, state, toggle }
}
