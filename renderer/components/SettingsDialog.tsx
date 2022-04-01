import { ChangeEvent } from 'react'
import {
  AppBar,
  Box,
  Toolbar,
  Dialog,
  Container,
  IconButton,
  Typography,
  FormControlLabel,
  Checkbox,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import Layout from 'components/Layout'
import { useStore } from 'utils/StoreContext'

type Props = {
  onRequestClose: () => void
  open: boolean
}

const SettingsDialog = (props: Props) => {
  const { onRequestClose, open } = props

  const { settings } = useStore()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.checked
    settings.setDarkMode(value)
  }

  return (
    <Dialog fullScreen onClose={onRequestClose} open={open}>
      <Layout hiddenSideBar>
        <AppBar color="default">
          <Toolbar variant="dense">
            <IconButton color="inherit" edge="start" onClick={onRequestClose}>
              <CloseIcon />
            </IconButton>
            <Typography component="div" sx={{ ml: 2, flex: 1 }} variant="h6">
              Settings
            </Typography>
          </Toolbar>
        </AppBar>
        <Toolbar variant="dense" />
        <Container>
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2">General</Typography>
            <FormControlLabel
              control={
                <Checkbox checked={settings.darkMode} onChange={handleChange} />
              }
              label="Use Dark Mode"
            />
          </Box>
        </Container>
      </Layout>
    </Dialog>
  )
}

export default SettingsDialog
