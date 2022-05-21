import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit'
import { AppState } from 'store'

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

export const { sort } = sortingSlice.actions

export default sortingSlice.reducer

export const selectSorting = (state: AppState) => state.sorting

export const selectGetSortOption = createSelector(
  selectSorting,
  (sorting) => (path: string) =>
    sorting[path] ?? ({ order: 'asc', orderBy: 'name' } as const)
)
