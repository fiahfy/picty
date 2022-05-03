import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react'
import { useStore as useOriginalStore } from 'store'

const StoreContext = createContext<
  ReturnType<typeof useOriginalStore> | undefined
>(undefined)

const key = 'store'

type Props = { children: ReactNode }

export const StoreProvider = (props: Props) => {
  const { children } = props

  const store = useOriginalStore()
  const { setState, state } = store

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
    setState(data)
  }, [parse, setState])

  useEffect(() => {
    const json = JSON.stringify(state)
    localStorage.setItem(key, json)
  }, [state])

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export const useStore = () => {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within a Provider')
  }
  return context
}
