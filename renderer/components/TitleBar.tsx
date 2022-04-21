import { AppBar, Toolbar, Typography } from '@mui/material'
import { useTitleBar } from 'utils/TitleBarContext'

const TitleBar = () => {
  const { shown } = useTitleBar()

  const handleDoubleClick = async () => {
    await window.electronAPI.doubleClickTitleBar()
  }

  return (
    <>
      {shown && (
        <AppBar
          color="default"
          component="div"
          elevation={0}
          onDoubleClick={handleDoubleClick}
          sx={{
            top: 0,
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar
            disableGutters
            sx={{
              WebkitAppRegion: 'drag',
              justifyContent: 'center',
              minHeight: '28px!important',
              padding: '2px 72px 0',
              userSelect: 'none',
            }}
          >
            <Typography align="center" noWrap variant="caption">
              picty
            </Typography>
          </Toolbar>
        </AppBar>
      )}
    </>
  )
}

export default TitleBar
