import { throttle } from 'throttle-debounce'
import {
  Box,
  Drawer as MuiDrawer,
  Toolbar,
  colors,
  styled,
} from '@mui/material'
import ExplorerTreeView from 'components/ExplorerTreeView'
import FavoriteTreeView from 'components/FavoriteTreeView'
import { useAppDispatch, useAppSelector } from 'store'
import { selectSettings, setDrawerHidden, setDrawerWidth } from 'store/settings'

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ open }) => ({
  ...(!open && {
    width: '0!important',
    '.MuiDrawer-paper': {
      width: '0!important',
    },
  }),
}))

const minContentWidth = 64

const SideBar = () => {
  const { drawerHidden, drawerWidth } = useAppSelector(selectSettings)
  const dispatch = useAppDispatch()

  const handleMouseDown = () => {
    document.addEventListener('mouseup', handleMouseUp, true)
    document.addEventListener('mousemove', handleMouseMove, true)
  }

  const handleMouseUp = () => {
    document.removeEventListener('mouseup', handleMouseUp, true)
    document.removeEventListener('mousemove', handleMouseMove, true)
  }

  const handleMouseMove = throttle(100, (e) => {
    const newWidth = e.clientX - document.body.offsetLeft + 3
    if (
      newWidth > minContentWidth &&
      newWidth < document.body.offsetWidth - minContentWidth
    ) {
      dispatch(setDrawerWidth(newWidth))
    }
    dispatch(setDrawerHidden(newWidth < minContentWidth / 2))
  })

  return (
    <Drawer
      PaperProps={{ style: { width: drawerWidth } }}
      anchor="left"
      open={!drawerHidden}
      style={{ width: drawerWidth }}
      variant="permanent"
    >
      <Toolbar
        sx={{
          flexShrink: 0,
          minHeight: (theme) => `${theme.mixins.titleBar.height}px!important`,
        }}
      />
      <Toolbar
        sx={{
          flexShrink: 0,
          minHeight: '65px!important',
        }}
      />
      <Box
        sx={{
          flexGrow: 1,
          marginRight: '5px',
          overflow: 'auto',
        }}
      >
        <FavoriteTreeView />
        <ExplorerTreeView />
      </Box>
      <Box
        onMouseDown={handleMouseDown}
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? colors.grey[100]
              : colors.grey[900],
          bottom: 0,
          cursor: 'ew-resize',
          position: 'absolute',
          right: 0,
          top: 0,
          width: '5px',
        }}
      />
    </Drawer>
  )
}

export default SideBar
