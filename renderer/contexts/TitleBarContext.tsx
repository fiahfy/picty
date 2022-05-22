import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const TitleBarContext = createContext<
  | {
      shown: boolean
    }
  | undefined
>(undefined)

type Props = { children: ReactNode }

export const TitleBarProvider = (props: Props) => {
  const { children } = props

  const [ready, setReady] = useState(false)
  const [darwin, setDarwin] = useState(false)
  const [fullScreen, setFullScreen] = useState(false)

  const shown = useMemo(() => darwin && !fullScreen, [darwin, fullScreen])

  useEffect(() => {
    const handleFullscreenChange = () =>
      setFullScreen(!!document.fullscreenElement)
    handleFullscreenChange()
    document.body.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.body.removeEventListener(
        'fullscreenchange',
        handleFullscreenChange
      )
    }
  }, [])

  useEffect(() => {
    ;(async () => {
      const darwin = await window.electronAPI.isDarwin()
      setDarwin(darwin)
      // for initial rendering
      setReady(true)
    })()
  }, [])

  const value = { shown }

  return (
    <TitleBarContext.Provider value={value}>
      {ready && children}
    </TitleBarContext.Provider>
  )
}

export const useTitleBar = () => {
  const context = useContext(TitleBarContext)
  if (!context) {
    throw new Error('useTitleBar must be used within a Provider')
  }
  return context
}
