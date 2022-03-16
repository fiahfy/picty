import {
  Box,
  Divider,
  Drawer as MuiDrawer,
  List,
  ListItemButton,
  ListItemIcon,
  Toolbar,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { Inbox as InboxIcon, Mail as MailIcon } from '@mui/icons-material'

const drawerWidth = 320
const drawerMinWidth = 64

const openedMixin = (theme) =>
  ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    width: drawerWidth,
  } as const)

const closedMixin = (theme) =>
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

const SideBar = () => {
  return (
    <Drawer anchor="left" open={open} variant="permanent">
      <Toolbar sx={{ flexShrink: 0 }} />
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Box sx={{ display: 'flex', width: drawerMinWidth }}>
          <List>
            {['Inbox', 'Starred', 'Send email'].map((text, index) => (
              <ListItemButton
                key={text}
                sx={{
                  minHeight: 48,
                  justifyContent: 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    justifyContent: 'center',
                  }}
                >
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
              </ListItemButton>
            ))}
          </List>
          <Divider orientation="vertical" />
        </Box>
        <Box sx={{ flexGrow: 1 }}></Box>
      </Box>
    </Drawer>
  )
}

export default SideBar
