import { useEffect, useMemo, useState } from 'react'
import { AppBar, Toolbar, Typography } from '@mui/material'

const TitleBar = () => {
  const [fullScreen, setFullScreen] = useState(false)
  const [isDarwin, setIsDarwin] = useState(false)

  const isVisible = useMemo(
    () => isDarwin && !fullScreen,
    [fullScreen, isDarwin]
  )

  const handleFullScreenChange = () => {
    setFullScreen(!!document.fullscreenElement)
  }

  useEffect(() => {
    ;(async () => {
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
        elevation={0}
        onDoubleClick={handleDoubleClick}
        position="fixed"
        sx={{
          WebkitAppRegion: 'drag',
          userSelect: 'none',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar
          sx={{
            justifyContent: 'center',
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
