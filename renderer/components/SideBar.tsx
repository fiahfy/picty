import { useCallback } from 'react'
import { Box, Drawer as MuiDrawer, Toolbar } from '@mui/material'
import { grey } from '@mui/material/colors'
import { styled } from '@mui/material/styles'
import ExplorerTreeView from 'components/ExplorerTreeView'
import FavoriteTreeView from 'components/FavoriteTreeView'
import { useAppDispatch, useAppSelector } from 'store'
import {
  selectDrawerHidden,
  selectDrawerWidth,
  setDrawerHidden,
  setDrawerWidth,
} from 'store/settings'

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
  const drawerHidden = useAppSelector(selectDrawerHidden)
  const drawerWidth = useAppSelector(selectDrawerWidth)
  const dispatch = useAppDispatch()

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const newWidth = e.clientX - document.body.offsetLeft + 3
      if (
        newWidth > minContentWidth &&
        newWidth < document.body.offsetWidth - minContentWidth
      ) {
        dispatch(setDrawerWidth(newWidth))
      }
      dispatch(setDrawerHidden(newWidth < minContentWidth / 2))
    },
    [dispatch]
  )

  const handleMouseUp = useCallback(() => {
    document.body.classList.remove('col-resizing')
    document.removeEventListener('mouseup', handleMouseUp, true)
    document.removeEventListener('mousemove', handleMouseMove, true)
  }, [handleMouseMove])

  const handleMouseDown = useCallback(() => {
    document.body.classList.add('col-resizing')
    document.addEventListener('mouseup', handleMouseUp, true)
    document.addEventListener('mousemove', handleMouseMove, true)
  }, [handleMouseMove, handleMouseUp])

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
          overflowX: 'hidden',
          overflowY: 'auto',
        }}
      >
        <FavoriteTreeView />
        <ExplorerTreeView />
      </Box>
      <Box
        onMouseDown={handleMouseDown}
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? grey[100] : grey[900],
          bottom: 0,
          cursor: 'col-resize',
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
