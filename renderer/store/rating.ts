import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit'
import { AppState } from 'store'

type State = {
  [path: string]: number
}

const initialState: State = {}

export const ratingSlice = createSlice({
  name: 'rating',
  initialState,
  reducers: {
    rate(state, action: PayloadAction<{ path: string; rating: number }>) {
      const { path, rating } = action.payload
      return {
        ...state,
        [path]: rating,
      }
    },
  },
})

export const { rate } = ratingSlice.actions

export default ratingSlice.reducer

export const selectRating = (state: AppState) => state.rating

export const selectGetRating = createSelector(
  selectRating,
  (rating) => (path: string) => rating[path] ?? 0
)
