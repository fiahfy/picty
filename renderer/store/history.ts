import { useCallback, useMemo, useReducer } from 'react'

type State = {
  directories: string[]
  index: number
}

type Action =
  | { type: 'set'; payload: Partial<State> }
  | { type: 'go'; payload: number }
  | { type: 'push'; payload: string }

const initialState: State = {
  directories: [],
  index: -1,
}

const reducer = (state: State, action: Action) => {
  const { type, payload } = action
  switch (type) {
    case 'set':
      return { ...state, ...payload }
    case 'go': {
      const index = state.index + payload
      const directory = state.directories[index]
      return directory ? { ...state, index } : state
    }
    case 'push': {
      const index = state.index + 1
      return {
        ...state,
        directories: [...state.directories.slice(0, index), payload],
        index,
      }
    }
    default:
      return state
  }
}

export const useStore = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const canBack = useMemo(() => state.index > 0, [state.index])
  const canForward = useMemo(
    () => state.index < state.directories.length - 1,
    [state.directories.length, state.index]
  )
  const directory = useMemo(
    () => state.directories[state.index],
    [state.directories, state.index]
  )

  const setState = useCallback(
    (state: Partial<State>) => dispatch({ type: 'set', payload: state }),
    []
  )
  const push = useCallback(
    (dir: string) => {
      if (dir !== directory) {
        dispatch({ type: 'push', payload: dir })
      }
    },
    [directory, dispatch]
  )
  const go = useCallback(
    (offset: number) => dispatch({ type: 'go', payload: offset }),
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
    setState,
    state,
  }
}
