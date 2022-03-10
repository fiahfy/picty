import { AppBar, Toolbar, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'

const TitleBar = () => {
  const [fullScreen, setFullScreen] = useState(false)

  const isVisible = useMemo(async () => {
    const isDarwin = await window.electronAPI.isDarwin()
    return isDarwin && !fullScreen
  }, [fullScreen])

  const handleFullScreenChange = () => {
    setFullScreen(!!document.fullscreenElement)
  }

  useEffect(() => {
    document.body.addEventListener('fullscreenchange', handleFullScreenChange)
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
            Clipped drawer
          </Typography>
        </Toolbar>
      </AppBar>
    )
  )
}

export default TitleBar
