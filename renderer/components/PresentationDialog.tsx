import { useEffect, useRef, useState } from 'react'
import {
  AppBar,
  Box,
  Toolbar,
  Dialog,
  Container,
  IconButton,
  Typography,
  Fade,
} from '@mui/material'
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Close as CloseIcon,
  Fullscreen as FullscreenIcon,
} from '@mui/icons-material'
import Layout from 'components/Layout'
import { usePersistedState } from 'utils/PersistedStateContext'

type Props = {
  onRequestClose: () => void
  open: boolean
}

const PresentationDialog = (props: Props) => {
  const { onRequestClose, open } = props

  const [toolbar, setToolbar] = useState(false)
  const timer = useRef<number>()
  const topToolbar = useRef<HTMLDivElement>()
  const bottomToolbar = useRef<HTMLDivElement>()

  const startTimer = () => {
    timer.current = window.setTimeout(() => setToolbar(false), 2000)
  }

  const clearTimer = () => {
    window.clearTimeout(timer.current)
  }

  const resetTimer = () => {
    setToolbar(true)
    clearTimer()
    const hovered =
      !!topToolbar.current?.querySelector(':hover') ||
      !!bottomToolbar.current?.querySelector(':hover')
    if (hovered) {
      return
    }
    startTimer()
  }

  useEffect(() => {
    if (open) {
      setToolbar(true)
      clearTimer()
      startTimer()
    }
    return () => clearTimer()
  }, [open])

  const handleMouseMove = () => resetTimer()

  return (
    <Dialog
      fullScreen
      onClose={onRequestClose}
      onMouseMove={handleMouseMove}
      open={open}
    >
      <Layout hiddenSideBar>
        <Fade in={toolbar} ref={topToolbar}>
          <AppBar color="transparent" elevation={0}>
            <Toolbar variant="dense">
              <IconButton color="inherit" edge="start" onClick={onRequestClose}>
                <CloseIcon />
              </IconButton>
              <Typography component="div" sx={{ ml: 2, flex: 1 }} variant="h6">
                Settings
              </Typography>
            </Toolbar>
          </AppBar>
        </Fade>
        <Fade in={toolbar} ref={bottomToolbar}>
          <AppBar
            color="transparent"
            component="footer"
            elevation={0}
            sx={{ top: 'auto', bottom: 0 }}
          >
            <Toolbar variant="dense">
              <IconButton color="inherit" edge="start">
                <ChevronLeftIcon />
              </IconButton>
              <IconButton color="inherit">
                <ChevronRightIcon />
              </IconButton>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton color="inherit" edge="end">
                <FullscreenIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
        </Fade>
      </Layout>
    </Dialog>
  )
}

export default PresentationDialog
