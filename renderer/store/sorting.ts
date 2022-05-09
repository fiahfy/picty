import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from 'store'

type Option = {
  order: 'asc' | 'desc'
  orderBy: 'name' | 'rating' | 'dateModified'
}

type State = {
  [path: string]: Option
}

const initialState: State = {}

export const sortingSlice = createSlice({
  name: 'sorting',
  initialState,
  reducers: {
    sort(state, action: PayloadAction<{ path: string; option: Option }>) {
      const { path, option } = action.payload
      return {
        ...state,
        [path]: option,
      }
    },
  },
})

export const actions = sortingSlice.actions

export default sortingSlice.reducer

export const useSorting = () => {
  const state = useAppSelector((state) => state.sorting)
  const dispatch = useAppDispatch()

  const getOption = useCallback(
    (path: string) =>
      state[path] ?? ({ order: 'asc', orderBy: 'name' } as const),
    [state]
  )

  const sort = useCallback(
    (path: string, option: Option) => dispatch(actions.sort({ path, option })),
    [dispatch]
  )

  return { getOption, sort, state }
}
