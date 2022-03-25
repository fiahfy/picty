import { useEffect, useMemo, useState } from 'react'
import { AppBar, Toolbar, Typography } from '@mui/material'
import { useTheme } from 'utils/ThemeContext'

const TitleBar = () => {
  const [fullScreen, setFullScreen] = useState(false)
  const [isDarwin, setIsDarwin] = useState(false)

  const { setTitleBar } = useTheme()

  const isVisible = useMemo(
    () => isDarwin && !fullScreen,
    [fullScreen, isDarwin]
  )

  useEffect(() => {
    setTitleBar(isVisible)
  }, [isVisible, setTitleBar])

  const handleFullScreenChange = () => {
    setFullScreen(!!document.fullscreenElement)
  }

  useEffect(() => {
    ;(async () => {
      setFullScreen(!!document.fullscreenElement)
      const isDarwin = await window.electronAPI.isDarwin()
      setIsDarwin(isDarwin)
      document.body.addEventListener('fullscreenchange', handleFullScreenChange)
    })()
    return () => {
      document.body.removeEventListener(
        'fullscreenchange',
        handleFullScreenChange
      )
    }
  }, [])

  const handleDoubleClick = async () => {
    await window.electronAPI.doubleClickTitleBar()
  }

  return (
    isVisible && (
      <AppBar
        color="default"
        elevation={0}
        onDoubleClick={handleDoubleClick}
        position="fixed"
        sx={{
          WebkitAppRegion: 'drag',
          top: 0,
          userSelect: 'none',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            justifyContent: 'center',
            minHeight: '22px!important',
            padding: '0 72px',
          }}
        >
          <Typography align="center" component="div" noWrap variant="caption">
            next-explorer
          </Typography>
        </Toolbar>
      </AppBar>
    )
  )
}

export default TitleBar
