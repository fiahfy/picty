import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react'
import * as explorer from 'utils/reducers/explorer'
import * as history from 'utils/reducers/history'
import * as settings from 'utils/reducers/settings'

const PersistedStateContext = createContext<
  | {
      explorer: ReturnType<typeof explorer.selectors> &
        ReturnType<typeof explorer.operations>
      history: ReturnType<typeof history.selectors> &
        ReturnType<typeof history.operations>
      settings: ReturnType<typeof settings.selectors> &
        ReturnType<typeof settings.operations>
    }
  | undefined
>(undefined)

export type GlobalState = {
  explorer: explorer.State
  history: history.State
  settings: settings.State
}

export type GlobalAction =
  | { type: 'init'; payload: GlobalState }
  | explorer.Action
  | history.Action
  | settings.Action

const initialState = {
  explorer: explorer.initialState,
  history: history.initialState,
  settings: settings.initialState,
}

const rootReducer = (state: GlobalState, action: GlobalAction) => {
  const { type, payload } = action
  switch (type) {
    case 'init':
      // TODO:
      return { ...state, ...payload }
    default:
      return settings.reducer(
        history.reducer(explorer.reducer(state, action), action),
        action
      )
  }
}

const key = 'key'

type Props = { children: ReactNode }

export const PersistedStateProvider = (props: Props) => {
  const { children } = props

  const [state, dispatch] = useReducer(rootReducer, initialState)

  const parse = useCallback((json: string | null) => {
    if (!json) {
      return {}
    }
    try {
      return JSON.parse(json) ?? {}
    } catch (e) {
      return {}
    }
  }, [])

  useEffect(() => {
    const json = localStorage.getItem(key)
    const data = parse(json)
    dispatch({ type: 'init', payload: data })
  }, [parse, dispatch])

  useEffect(() => {
    const json = JSON.stringify(state)
    localStorage.setItem(key, json)
  }, [state])

  const value = {
    explorer: {
      ...explorer.selectors(state),
      ...explorer.operations(dispatch),
    },
    history: { ...history.selectors(state), ...history.operations(dispatch) },
    settings: {
      ...settings.selectors(state),
      ...settings.operations(dispatch),
    },
  }

  return (
    <PersistedStateContext.Provider value={value}>
      {children}
    </PersistedStateContext.Provider>
  )
}

export const usePersistedState = () => {
  const context = useContext(PersistedStateContext)
  if (!context) {
    throw new Error('usePersistedState must be used within a Provider')
  }
  return context
}
