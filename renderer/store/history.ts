import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { AppState } from 'store'

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

export const selectCurrentDirectory = (state: AppState) =>
  state.history.directories[state.history.index] ?? ''
export const selectCanBack = (state: AppState) => state.history.index > 0
export const selectCanForward = (state: AppState) =>
  state.history.index < state.history.directories.length - 1
