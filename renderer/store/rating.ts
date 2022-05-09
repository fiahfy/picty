import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from 'store'

type State = {
  [path: string]: number
}

const initialState: State = {}

export const ratingSlice = createSlice({
  name: 'rating',
  initialState,
  reducers: {
    setRating(state, action: PayloadAction<{ path: string; rating: number }>) {
      const { path, rating } = action.payload
      return {
        ...state,
        [path]: rating,
      }
    },
  },
})

export const actions = ratingSlice.actions

export default ratingSlice.reducer

export const useRating = () => {
  const state = useAppSelector((state) => state.rating)
  const dispatch = useAppDispatch()

  const getRating = useCallback((path: string) => state[path] ?? 0, [state])

  const setRating = useCallback(
    (path: string, rating: number) =>
      dispatch(actions.setRating({ path, rating })),
    [dispatch]
  )

  return { getRating, setRating, state }
}
