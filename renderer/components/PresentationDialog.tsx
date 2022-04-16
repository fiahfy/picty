import {
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import fileUrl from 'file-url'
import {
  AppBar,
  Box,
  Dialog,
  Fade,
  IconButton,
  LinearProgress,
  Slider,
  Toolbar,
  Typography,
} from '@mui/material'
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Close as CloseIcon,
  FullscreenExit as FullscreenExitIcon,
  Fullscreen as FullscreenIcon,
} from '@mui/icons-material'
import Layout from 'components/Layout'
import { Content } from 'interfaces'
import { useTheme } from 'utils/ThemeContext'
import { isImageFile } from 'utils/image'
import { useStore } from 'utils/StoreContext'

type Props = {
  onRequestClose: () => void
  open: boolean
  path: string
}

const PresentationDialog = (props: Props) => {
  const { path, onRequestClose, open } = props

  const { settings } = useStore()
  const { forceMode, resetMode } = useTheme()

  const [index, setIndex] = useState(0)
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(false)
  const [toolbar, setToolbar] = useState(false)
  const timer = useRef<number>()
  const topToolbar = useRef<HTMLDivElement>()
  const bottomToolbar = useRef<HTMLDivElement>()

  const clearTimer = useCallback(() => window.clearTimeout(timer.current), [])

  const resetTimer = useCallback(() => {
    setToolbar(true)
    clearTimer()
    const hovered =
      !!topToolbar.current?.querySelector(':hover') ||
      !!bottomToolbar.current?.querySelector(':hover')
    if (hovered) {
      return
    }
    timer.current = window.setTimeout(() => setToolbar(false), 2000)
  }, [clearTimer])

  useEffect(() => {
    ;(async () => {
      settings.fullscreenOnPresentation && document.body.requestFullscreen()
      forceMode('dark')
      resetTimer()
      setIndex(0)
      setContents([])
      setLoading(true)
      const contents = (
        await window.electronAPI.listContentsForPath(path)
      ).filter((content) => isImageFile(content.path))
      setContents(contents)
      const index = contents.findIndex((content) => content.path === path)
      setIndex(index > -1 ? index : 0)
      setLoading(false)
    })()
    return () => {
      clearTimer()
      resetMode()
      document.exitFullscreen()
    }
  }, [
    clearTimer,
    forceMode,
    open,
    path,
    resetMode,
    resetTimer,
    settings.fullscreenOnPresentation,
  ])

  const content = useMemo(() => contents[index], [contents, index])

  const fullscreen = !!document.fullscreenElement

  const movePrevious = () => {
    setIndex((prevIndex) => {
      let index = prevIndex - 1
      if (index < 0) {
        index = contents.length - 1
      }
      return index
    })
  }

  const moveNext = () => {
    setIndex((prevIndex) => {
      let index = prevIndex + 1
      if (index > contents.length - 1) {
        index = 0
      }
      return index
    })
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        return movePrevious()
      case 'ArrowRight':
      case 'ArrowDown':
        return moveNext()
      case 'Tab':
        return resetTimer()
    }
  }

  const handleMouseMove = () => resetTimer()

  const handleClickPrevious = () => movePrevious()

  const handleClickNext = () => moveNext()

  const handleClickFullscreen = () =>
    fullscreen ? document.exitFullscreen() : document.body.requestFullscreen()

  const handleChange = (_e: Event, value: number | number[]) => {
    if (!Array.isArray(value)) {
      setIndex(value)
    }
  }

  return (
    <Dialog
      fullScreen
      onClose={onRequestClose}
      onKeyDown={handleKeyDown}
      onMouseMove={handleMouseMove}
      open={open}
      transitionDuration={0}
    >
      <Layout hideBars>
        <Fade in={toolbar} ref={topToolbar}>
          <AppBar color="transparent" elevation={0}>
            <Box
              sx={{
                background:
                  'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))',
                pb: 15,
              }}
            >
              <Toolbar variant="dense">
                <IconButton
                  color="inherit"
                  edge="start"
                  onClick={onRequestClose}
                >
                  <CloseIcon />
                </IconButton>
                <Typography
                  component="div"
                  sx={{ ml: 2, flex: 1 }}
                  variant="subtitle1"
                >
                  {content?.name}
                </Typography>
              </Toolbar>
            </Box>
          </AppBar>
        </Fade>
        {loading && (
          <Box sx={{ position: 'absolute', top: 0, width: '100%' }}>
            <LinearProgress />
          </Box>
        )}
        {content && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={fileUrl(content.path)}
            style={{
              display: 'block',
              height: '100%',
              objectFit: 'scale-down',
              width: '100%',
            }}
          />
        )}
        <Fade in={toolbar} ref={bottomToolbar}>
          <AppBar
            color="transparent"
            component="footer"
            elevation={0}
            sx={{ top: 'auto', bottom: 0 }}
          >
            <Box
              sx={{
                background:
                  'linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5))',
                pt: 15,
              }}
            >
              <Toolbar variant="dense">
                <Slider
                  max={contents.length - 1}
                  min={0}
                  onChange={handleChange}
                  size="small"
                  sx={{
                    position: 'absolute',
                    left: 0,
                    lineHeight: 0,
                    top: -14,
                    width: '100%',
                    zIndex: (theme) => theme.zIndex.appBar + 1,
                  }}
                  value={index}
                />
                <IconButton
                  color="inherit"
                  edge="start"
                  onClick={handleClickPrevious}
                >
                  <ChevronLeftIcon />
                </IconButton>
                <IconButton color="inherit" onClick={handleClickNext}>
                  <ChevronRightIcon />
                </IconButton>
                <Typography component="div" sx={{ ml: 1 }} variant="body1">
                  {index + 1} / {contents.length}
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton
                  color="inherit"
                  edge="end"
                  onClick={handleClickFullscreen}
                >
                  {fullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                </IconButton>
              </Toolbar>
            </Box>
          </AppBar>
        </Fade>
      </Layout>
    </Dialog>
  )
}

export default PresentationDialog
