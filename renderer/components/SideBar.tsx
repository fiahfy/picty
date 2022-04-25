import { useCallback } from 'react'
import {
  Box,
  // Divider,
  // List,
  // ListItemButton,
  // ListItemIcon,
  Drawer as MuiDrawer,
  // Theme,
  Toolbar,
  colors,
  styled,
} from '@mui/material'
// import {
//   Explore as ExploreIcon,
//   Favorite as FavoriteIcon,
//   Settings as SettingsIcon,
// } from '@mui/icons-material'
import ExplorerTreeView from 'components/ExplorerTreeView'
import { useStore } from 'utils/StoreContext'
import { throttle } from 'throttle-debounce'

// const drawerWidth = 256
// const drawerMinWidth = 56

// const openedMixin = (theme: Theme) =>
//   ({
//     transition: theme.transitions.create('width', {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//   } as const)

// const closedMixin = (theme: Theme) =>
//   ({
//     transition: theme.transitions.create('width', {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.leavingScreen,
//     }),
//     width: '0!important',
//   } as const)

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

// const open = true
const minContentWidth = 64

const SideBar = () => {
  const { settings } = useStore()

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
      settings.setDrawerWidth(newWidth)
    }
    settings.setDrawerHidden(newWidth < minContentWidth / 2)
  })

  return (
    <Drawer
      PaperProps={{ style: { width: settings.drawerWidth } }}
      anchor="left"
      open={!settings.drawerHidden}
      style={{ width: settings.drawerWidth }}
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
    </Drawer>
  )
}

export default SideBar
