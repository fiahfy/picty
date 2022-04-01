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
  Toolbar,
  Dialog,
  IconButton,
  Typography,
  Fade,
  LinearProgress,
  Slider,
} from '@mui/material'
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Close as CloseIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
} from '@mui/icons-material'
import Layout from 'components/Layout'
import { Content } from 'interfaces'
import { useTheme } from 'utils/ThemeContext'
import { isImageFile } from 'utils/image'

type Props = {
  directory: string
  onRequestClose: () => void
  open: boolean
}

const PresentationDialog = (props: Props) => {
  const { directory, onRequestClose, open } = props

  const { forceMode, resetMode } = useTheme()

  const [index, setIndex] = useState(0)
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(false)
  const [toolbar, setToolbar] = useState(false)
  const timer = useRef<number>()
  const topToolbar = useRef<HTMLDivElement>()
  const bottomToolbar = useRef<HTMLDivElement>()

  const clearTimer = () => {
    window.clearTimeout(timer.current)
  }

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
  }, [])

  useEffect(() => {
    ;(async () => {
      forceMode('dark')
      resetTimer()
      setIndex(0)
      setContents([])
      setLoading(true)
      const contents = await window.electronAPI.listContents(directory)
      setContents(contents)
      setLoading(false)
    })()
    return () => {
      clearTimer()
      resetMode()
    }
  }, [directory, forceMode, open, resetMode, resetTimer])

  const images = useMemo(
    () => contents.filter((content) => isImageFile(content.path)),
    [contents]
  )

  const image = useMemo(() => images[index], [images, index])

  const fullscreen = !!document.fullscreenElement

  const movePrevious = () => {
    setIndex((prevIndex) => {
      let index = prevIndex - 1
      if (index < 0) {
        index = images.length - 1
      }
      return index
    })
  }
  const moveNext = () => {
    setIndex((prevIndex) => {
      let index = prevIndex + 1
      if (index > images.length - 1) {
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

  const handleClickFullscreenEnter = () => document.body.requestFullscreen()

  const handleClickFullscreenExit = () => document.exitFullscreen()

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
    >
      <Layout hiddenSideBar>
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
                  {image?.name}
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
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={fileUrl(image.path)}
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
                  max={images.length - 1}
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
                  {index + 1} / {images.length}
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton color="inherit" edge="end">
                  {fullscreen ? (
                    <FullscreenExitIcon onClick={handleClickFullscreenExit} />
                  ) : (
                    <FullscreenIcon onClick={handleClickFullscreenEnter} />
                  )}
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
