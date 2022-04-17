import { useCallback, useEffect, useState } from 'react'
import {
  Box,
  // Divider,
  // List,
  // ListItemButton,
  // ListItemIcon,
  Drawer,
  // Theme,
  Toolbar,
  colors,
  // styled,
} from '@mui/material'
// import {
//   Explore as ExploreIcon,
//   Favorite as FavoriteIcon,
//   Settings as SettingsIcon,
// } from '@mui/icons-material'
import ExplorerTreeView from 'components/ExplorerTreeView'
import SettingsDialog from 'components/SettingsDialog'

// const drawerWidth = 256
// const drawerMinWidth = 56

// const openedMixin = (theme: Theme) =>
//   ({
//     transition: theme.transitions.create('width', {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//     width: drawerWidth,
//   } as const)

// const closedMixin = (theme: Theme) =>
//   ({
//     transition: theme.transitions.create('width', {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.leavingScreen,
//     }),
//     width: drawerMinWidth,
//   } as const)

// const Drawer = styled(MuiDrawer, {
//   shouldForwardProp: (prop) => prop !== 'open',
// })(({ theme, open }) => ({
//   boxSizing: 'border-box',
//   ...(open && {
//     ...openedMixin(theme),
//     '& .MuiDrawer-paper': openedMixin(theme),
//   }),
//   ...(!open && {
//     ...closedMixin(theme),
//     '& .MuiDrawer-paper': closedMixin(theme),
//   }),
// }))

// const open = true
const minContentWidth = 64

const SideBar = () => {
  const [drawerWidth, setDrawerWidth] = useState(256)
  const [dialogOpen, setDialogOpen] = useState(false)

  // const items = [
  //   { icon: <ExploreIcon />, key: 'explorer' },
  //   { icon: <FavoriteIcon />, key: 'favorite' },
  //   { key: 'spacer', type: 'spacer' },
  //   {
  //     icon: <SettingsIcon />,
  //     key: 'settings',
  //     onClick: () => setDialogOpen(true),
  //   },
  // ]

  useEffect(() => {
    const unsubscribe = window.electronAPI.subscribeShowSettings(() =>
      setDialogOpen(true)
    )
    return () => unsubscribe()
  }, [])

  const handleRequestClose = () => setDialogOpen(false)

  const handleMouseDown = () => {
    document.addEventListener('mouseup', handleMouseUp, true)
    document.addEventListener('mousemove', handleMouseMove, true)
  }

  const handleMouseUp = () => {
    document.removeEventListener('mouseup', handleMouseUp, true)
    document.removeEventListener('mousemove', handleMouseMove, true)
  }

  const handleMouseMove = useCallback((e) => {
    const newWidth = e.clientX - document.body.offsetLeft + 3
    if (
      newWidth > minContentWidth &&
      newWidth < document.body.offsetWidth - minContentWidth
    ) {
      setDrawerWidth(newWidth)
    }
  }, [])

  return (
    <Drawer
      PaperProps={{ style: { width: drawerWidth } }}
      anchor="left"
      open
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
      <Box sx={{ display: 'flex', flexGrow: 1, minHeight: 0 }}>
        {/* <Box sx={{ display: 'flex', flexShrink: 0, width: drawerMinWidth }}>
          <List
            disablePadding
            sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
          >
            {items.map((item) =>
              item.type === 'spacer' ? (
                <Box key={item.key} sx={{ flexGrow: 1 }} />
              ) : (
                <ListItemButton
                  key={item.key}
                  onClick={item.onClick}
                  sx={{
                    flexGrow: 0,
                    height: 48,
                    justifyContent: 'center',
                    p: 0,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                </ListItemButton>
              )
            )}
          </List>
          <Divider orientation="vertical" />
        </Box> */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <ExplorerTreeView />
        </Box>
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
          width: 5,
        }}
      />
      <SettingsDialog onRequestClose={handleRequestClose} open={dialogOpen} />
    </Drawer>
  )
}

export default SideBar
