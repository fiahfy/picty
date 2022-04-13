import { ChangeEvent } from 'react'
import {
  AppBar,
  Box,
  Checkbox,
  Container,
  Dialog,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Toolbar,
  Typography,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import Layout from 'components/Layout'
import { useStore } from 'utils/StoreContext'

const explorerLayoutOptions = [
  { text: 'List View', value: 'list' },
  { text: 'Thumbnail View', value: 'thumbnail' },
]

type Props = {
  onRequestClose: () => void
  open: boolean
}

const SettingsDialog = (props: Props) => {
  const { onRequestClose, open } = props

  const { settings } = useStore()

  const handleChangeDarkMode = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.checked
    settings.setDarkMode(value)
  }

  const handleChangeExplorerLayout = (
    e: SelectChangeEvent<'list' | 'thumbnail'>
  ) => {
    const value = e.target.value as 'list' | 'thumbnail'
    settings.setExplorerLayout(value)
  }

  const handleChangeFullscreenOnPresentation = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.currentTarget.checked
    settings.setFullscreenOnPresentation(value)
  }

  return (
    <Dialog fullScreen onClose={onRequestClose} open={open}>
      <Layout hideBars>
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
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={settings.darkMode}
                    onChange={handleChangeDarkMode}
                  />
                }
                label="Use Dark Mode"
              />
            </FormGroup>
          </Box>
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2">Explorer</Typography>
            <FormControl sx={{ mt: 2 }}>
              <InputLabel>Layout</InputLabel>
              <Select
                label="Layout"
                onChange={handleChangeExplorerLayout}
                value={settings.explorerLayout}
              >
                {explorerLayoutOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.text}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormGroup sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={settings.fullscreenOnPresentation}
                    onChange={handleChangeFullscreenOnPresentation}
                  />
                }
                label="Enter Fullscreen on Presentation"
              />
            </FormGroup>
          </Box>
        </Container>
      </Layout>
    </Dialog>
  )
}

export default SettingsDialog
