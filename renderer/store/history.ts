import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit'
import { AppState, AppThunk } from 'store'

type State = {
  directories: string[]
  index: number
}

const initialState: State = {
  directories: [],
  index: -1,
}

export const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    go(state, action: PayloadAction<number>) {
      const index = state.index + action.payload
      const directory = state.directories[index]
      return directory ? { ...state, index } : state
    },
    push(state, action: PayloadAction<string>) {
      const index = state.index + 1
      return {
        ...state,
        directories: [...state.directories.slice(0, index), action.payload],
        index,
      }
    },
  },
})

export const { go, push } = historySlice.actions

export default historySlice.reducer

export const selectHistory = (state: AppState) => state.history

export const selectCurrentDirectory = createSelector(
  selectHistory,
  (history) => history.directories[history.index] ?? ''
)

export const selectCanBack = createSelector(
  selectHistory,
  (history) => history.index > 0
)

export const selectCanForward = createSelector(
  selectHistory,
  (history) => history.index < history.directories.length - 1
)

export const back = (): AppThunk => async (dispatch) => dispatch(go(-1))

export const forward = (): AppThunk => async (dispatch) => dispatch(go(1))
