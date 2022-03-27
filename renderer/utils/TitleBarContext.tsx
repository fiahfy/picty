import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const TitleBarContext = createContext<{
  shown: boolean
}>({
  shown: false,
})

type Props = { children: ReactNode }

export const TitleBarProvider = (props: Props) => {
  const { children } = props

  const [darwin, setDarwin] = useState(false)
  const [fullScreen, setFullScreen] = useState(false)

  const handleFullScreenChange = () => {
    setFullScreen(!!document.fullscreenElement)
  }

  const shown = useMemo(() => darwin && !fullScreen, [darwin, fullScreen])

  useEffect(() => {
    ;(async () => {
      setFullScreen(!!document.fullscreenElement)
      const darwin = await window.electronAPI.isDarwin()
      setDarwin(darwin)
      document.body.addEventListener('fullscreenchange', handleFullScreenChange)
    })()
    return () => {
      document.body.removeEventListener(
        'fullscreenchange',
        handleFullScreenChange
      )
    }
  }, [])

  const value = { shown }

  return (
    <TitleBarContext.Provider value={value}>
      {children}
    </TitleBarContext.Provider>
  )
}

export const useTitleBar = () => useContext(TitleBarContext)
