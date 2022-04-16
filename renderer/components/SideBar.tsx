import { useState } from 'react'
import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  Drawer as MuiDrawer,
  Theme,
  Toolbar,
  styled,
} from '@mui/material'
import {
  // Explore as ExploreIcon,
  // Favorite as FavoriteIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material'
import ExplorerTreeView from 'components/ExplorerTreeView'
import SettingsDialog from 'components/SettingsDialog'

const drawerWidth = 320
const drawerMinWidth = 56

const openedMixin = (theme: Theme) =>
  ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    width: drawerWidth,
  } as const)

const closedMixin = (theme: Theme) =>
  ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: drawerMinWidth,
  } as const)

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}))

const open = true

const SideBar = () => {
  const [dialogOpen, setDialogOpen] = useState(false)

  const items = [
    // { icon: <ExploreIcon />, key: 'explorer' },
    // { icon: <FavoriteIcon />, key: 'favorite' },
    { key: 'spacer', type: 'spacer' },
    {
      icon: <SettingsIcon />,
      key: 'settings',
      onClick: () => setDialogOpen(true),
    },
  ]

  const handleRequestClose = () => setDialogOpen(false)

  return (
    <Drawer anchor="left" open={open} variant="permanent">
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
        <Box sx={{ display: 'flex', flexShrink: 0, width: drawerMinWidth }}>
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
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <ExplorerTreeView />
        </Box>
      </Box>
      <SettingsDialog onRequestClose={handleRequestClose} open={dialogOpen} />
    </Drawer>
  )
}

export default SideBar
