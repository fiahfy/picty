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
  settings: {
    darkMode: boolean
  }
}

const initialState = {
  currentDirectory: '',
  settings: {
    darkMode: false,
  },
}

const PersistedStateContext = createContext<{
  setCurrentDirectory: (currentDirectory: string) => void
  setDarkMode: (darkMode: boolean) => void
  state: State
}>({
  setCurrentDirectory: () => undefined,
  setDarkMode: () => undefined,
  state: initialState,
})

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

  const setDarkMode = useCallback((darkMode: boolean) => {
    setState((prevState) => ({
      ...prevState,
      settings: {
        ...prevState.settings,
        darkMode,
      },
    }))
  }, [])

  const value = { setCurrentDirectory, setDarkMode, state }

  return (
    <PersistedStateContext.Provider value={value}>
      {restored && children}
    </PersistedStateContext.Provider>
  )
}

export const usePersistedState = () => useContext(PersistedStateContext)
