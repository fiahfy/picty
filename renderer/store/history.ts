import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from 'store'

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

export const actions = historySlice.actions

export default historySlice.reducer

export const useHistory = () => {
  const state = useAppSelector((state) => state.history)
  const dispatch = useAppDispatch()

  const canBack = useMemo(() => state.index > 0, [state.index])
  const canForward = useMemo(
    () => state.index < state.directories.length - 1,
    [state.directories.length, state.index]
  )
  const directory = useMemo(
    () => state.directories[state.index] ?? '',
    [state.directories, state.index]
  )

  const push = useCallback(
    (dir: string) => {
      if (dir !== directory) {
        dispatch(actions.push(dir))
      }
    },
    [directory, dispatch]
  )
  const go = useCallback(
    (offset: number) => dispatch(actions.go(offset)),
    [dispatch]
  )
  const back = useCallback(() => go(-1), [go])
  const forward = useCallback(() => go(1), [go])

  return {
    back,
    canBack,
    canForward,
    directory,
    forward,
    go,
    push,
    state,
  }
}
