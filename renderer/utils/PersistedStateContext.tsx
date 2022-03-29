import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

type State = {
  currentDirectory: string
  history: {
    directories: string[]
    index: number
  }
  settings: {
    darkMode: boolean
  }
}

const initialState: State = {
  currentDirectory: '',
  history: {
    directories: [],
    index: -1,
  },
  settings: {
    darkMode: false,
  },
}

const PersistedStateContext = createContext<{
  currentDirectory: string
  setCurrentDirectory: (currentDirectory: string) => void
  history: {
    back: () => string
    canBack: boolean
    canForward: boolean
    forward: () => string
    push: (directory: string) => void
  }
  settings: {
    darkMode: boolean
    setDarkMode: (darkMode: boolean) => void
  }
}>({
  currentDirectory: initialState.currentDirectory,
  setCurrentDirectory: () => undefined,
  history: {
    back: () => '',
    canBack: false,
    canForward: false,
    forward: () => '',
    push: () => undefined,
  },
  settings: { ...initialState.settings, setDarkMode: () => undefined },
})

const useHistory = (
  history: State['history'],
  setHistory: (history: Partial<State['history']>) => void
) => {
  const canBack = history.index > 0
  const canForward = history.index < history.directories.length - 1
  const go = useCallback(
    (offset: number) => {
      const index = history.index + offset
      const directory = history.directories[index]
      if (!directory) {
        return ''
      }
      setHistory({ index })
      return history.directories[index]
    },
    [history.directories, history.index, setHistory]
  )
  const back = useCallback(() => go(-1), [go])
  const forward = useCallback(() => go(1), [go])
  const push = (directory: string) => {
    const index = history.index + 1
    const directories = [...history.directories.slice(0, index), directory]
    setHistory({ directories, index })
  }
  return { back, canBack, canForward, forward, push }
}

const useSettings = (
  settings: State['settings'],
  setSettings: (settings: Partial<State['settings']>) => void
) => {
  const darkMode = settings.darkMode
  const setDarkMode = useCallback(
    (darkMode: boolean) => setSettings({ darkMode }),
    [setSettings]
  )
  return { darkMode, setDarkMode }
}

const key = 'key'

type Props = { children: ReactNode }

export const PersistedStateProvider = (props: Props) => {
  const { children } = props

  const [restored, setRestored] = useState(false)
  const [state, setState] = useState(initialState)

  const parse = useCallback((json: string | null) => {
    if (!json) {
      return false
    }
    try {
      return JSON.parse(json) ?? false
    } catch (e) {
      return false
    }
  }, [])

  useEffect(() => {
    const json = localStorage.getItem(key)
    const data = parse(json)
    if (data) {
      // TODO: need deep merge with prev state
      setState(data)
    }
    setRestored(true)
  }, [parse])

  useEffect(() => {
    const json = JSON.stringify(state)
    localStorage.setItem(key, json)
  }, [state])

  const setCurrentDirectory = useCallback((currentDirectory: string) => {
    setState((prevState) => ({
      ...prevState,
      currentDirectory,
    }))
  }, [])

  const setHistory = useCallback((history: Partial<State['history']>) => {
    setState((prevState) => ({
      ...prevState,
      history: {
        ...prevState.history,
        ...history,
      },
    }))
  }, [])

  const setSettings = useCallback((settings: Partial<State['settings']>) => {
    setState((prevState) => ({
      ...prevState,
      settings: {
        ...prevState.settings,
        ...settings,
      },
    }))
  }, [])

  const value = {
    currentDirectory: state.currentDirectory,
    setCurrentDirectory,
    history: useHistory(state.history, setHistory),
    settings: useSettings(state.settings, setSettings),
  }

  return (
    <PersistedStateContext.Provider value={value}>
      {restored && children}
    </PersistedStateContext.Provider>
  )
}

export const usePersistedState = () => useContext(PersistedStateContext)
