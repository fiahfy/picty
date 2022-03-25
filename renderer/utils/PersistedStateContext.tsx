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

  const [state, setState] = useState(initialState)

  const parse = useCallback((json: string) => {
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
  }, [parse])

  useEffect(() => {
    const json = JSON.stringify(state)
    localStorage.setItem(key, json)
  }, [state])

  const setCurrentDirectory = (currentDirectory: string) => {
    setState((prevState) => ({
      ...prevState,
      currentDirectory,
    }))
  }

  const setDarkMode = (darkMode: boolean) => {
    setState((prevState) => ({
      ...prevState,
      settings: {
        ...prevState.settings,
        darkMode,
      },
    }))
  }

  const value = { setCurrentDirectory, setDarkMode, state }

  return (
    <PersistedStateContext.Provider value={value}>
      {children}
    </PersistedStateContext.Provider>
  )
}

export const usePersistedState = () => useContext(PersistedStateContext)
