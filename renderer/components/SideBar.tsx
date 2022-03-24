import {
  Box,
  Divider,
  Drawer as MuiDrawer,
  List,
  ListItemButton,
  ListItemIcon,
  Toolbar,
  styled,
  Theme,
} from '@mui/material'
import {
  Explore as ExploreIcon,
  Favorite as FavoriteIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material'

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
    width: `calc(${drawerMinWidth}px + 1px)`,
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

const items = [
  { icon: <ExploreIcon />, key: 'explorer' },
  { icon: <FavoriteIcon />, key: 'favorite' },
  { key: 'spacer', type: 'spacer' },
  { icon: <SettingsIcon />, key: 'settings' },
]

const SideBar = () => {
  return (
    <Drawer anchor="left" open={open} variant="permanent">
      <Toolbar sx={{ flexShrink: 0 }} />
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Box sx={{ display: 'flex', width: drawerMinWidth + 1 }}>
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
                  selected
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
        <Box sx={{ flexGrow: 1 }}></Box>
      </Box>
    </Drawer>
  )
}

export default SideBar
