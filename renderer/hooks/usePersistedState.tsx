import { useEffect, useState } from 'react'

const key = 'key'

const usePersistedState = () => {
  const [state, originalSetState] = useState<any>({})

  useEffect(() => {
    const json = localStorage.getItem(key)
    const data = JSON.parse(json) ?? {}
    originalSetState(data)
  }, [])

  const setState = (data) => {
    originalSetState(data)
    const json = JSON.stringify(data)
    localStorage.setItem(key, json)
  }

  return [state, setState]
}

export default usePersistedState
