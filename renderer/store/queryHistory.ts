import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { AppState } from 'store'

type State = string[]

const initialState: State = []

export const querySlice = createSlice({
  name: 'queryHistory',
  initialState,
  reducers: {
    add(state, action: PayloadAction<string>) {
      const query = action.payload
      if (!query) {
        return state
      }
      const index = state.indexOf(query)
      if (index > -1) {
        return [...state.filter((_, i) => i !== index), query]
      } else {
        return [...state, query]
      }
    },
  },
})

export const { add } = querySlice.actions

export default querySlice.reducer

export const selectQueryHistories = (state: AppState) => state.queryHistory
