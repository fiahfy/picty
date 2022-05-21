import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit'
import { AppState, AppThunk } from 'store'

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

export const { add, remove } = favoriteSlice.actions

export default favoriteSlice.reducer

export const selectFavorite = (state: AppState) => state.favorite

export const selectIsFavorite = createSelector(
  selectFavorite,
  (favorite) => (path: string) => favorite[path] ?? false
)

export const selectFavorites = createSelector(selectFavorite, (favorite) =>
  Object.keys(favorite).reduce(
    (carry, path) => [...carry, path],
    [] as string[]
  )
)

export const toggle =
  (path: string): AppThunk =>
  async (dispatch, getState) => {
    const favorite = selectIsFavorite(getState())(path)
    const action = favorite ? remove(path) : add(path)
    dispatch(action)
  }
