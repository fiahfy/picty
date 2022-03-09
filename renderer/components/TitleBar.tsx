import { AppBar, Toolbar, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

const TitleBar = () => {
  const [fullScreen, setFullScreen] = useState(false)

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

  // @see https://github.com/electron/electron/issues/16385
  const handleDoubleClick = () => {
    // const doubleClickAction = systemPreferences.getUserDefault(
    //   'AppleActionOnDoubleClick',
    //   'string'
    // )
    // const win = getCurrentWindow()
    // if (doubleClickAction === 'Minimize') {
    //   win.minimize()
    // } else if (doubleClickAction === 'Maximize') {
    //   if (win.isMaximized()) {
    //     win.unmaximize()
    //   } else {
    //     win.maximize()
    //   }
    // }
  }

  return (
    !fullScreen && (
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
