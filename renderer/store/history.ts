import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit'
import { AppState, AppThunk } from 'store'

type History = {
  directory: string
  scrollTop: number
}

type State = {
  histories: History[]
  index: number
}

const initialState: State = {
  histories: [],
  index: -1,
}

export const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    go(state, action: PayloadAction<number>) {
      const index = state.index + action.payload
      const history = state.histories[index]
      return history ? { ...state, index } : state
    },
    move(state, action: PayloadAction<string>) {
      const index = state.index + 1
      return {
        ...state,
        histories: [
          ...state.histories.slice(0, index),
          { directory: action.payload, scrollTop: 0 },
        ],
        index,
      }
    },
    scroll(state, action: PayloadAction<number>) {
      return {
        ...state,
        histories: state.histories.map((history, i) =>
          i === state.index
            ? { ...history, scrollTop: action.payload }
            : history
        ),
      }
    },
  },
})

export const { go, move, scroll } = historySlice.actions

export default historySlice.reducer

export const selectHistory = (state: AppState) => state.history

export const selectCurrentHistory = createSelector(
  selectHistory,
  (history) =>
    history.histories[history.index] ?? { directory: '', scrollTop: 0 }
)

export const selectCurrentDirectory = createSelector(
  selectCurrentHistory,
  (currentHistory) => currentHistory.directory
)

export const selectCurrentScrollTop = createSelector(
  selectCurrentHistory,
  (currentHistory) => currentHistory.scrollTop
)

export const selectCanBack = createSelector(
  selectHistory,
  (history) => history.index > 0
)

export const selectCanForward = createSelector(
  selectHistory,
  (history) => history.index < history.histories.length - 1
)

export const back = (): AppThunk => async (dispatch) => dispatch(go(-1))

export const forward = (): AppThunk => async (dispatch) => dispatch(go(1))
