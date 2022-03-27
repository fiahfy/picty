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
            <Typography align="center" noWrap variant="caption">
              next-explorer
            </Typography>
          </Toolbar>
        </AppBar>
      )}
    </>
  )
}

export default TitleBar
