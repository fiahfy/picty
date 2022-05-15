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
} from '@mui/icons-material'
import Layout from 'components/Layout'
import { useTheme } from 'contexts/ThemeContext'
import { File } from 'interfaces'
import { isImageFile } from 'utils/image'

type Props = {
  onRequestClose: () => void
  open: boolean
  path: string
}

const PresentationDialog = (props: Props) => {
  const { path, onRequestClose, open } = props

  const { forceMode, resetMode } = useTheme()

  const [index, setIndex] = useState(0)
  const [images, setImages] = useState<File[]>([])
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
    const handler = () => !document.fullscreenElement && onRequestClose()
    document.body.addEventListener('fullscreenchange', handler)
    return () => {
      document.body.removeEventListener('fullscreenchange', handler)
    }
  }, [onRequestClose])

  useEffect(() => {
    ;(async () => {
      if (open) {
        document.body.requestFullscreen()
        forceMode('dark')
        resetTimer()
        setIndex(0)
        setImages([])
        setLoading(true)
        const files = await window.electronAPI.listFilesWithPath(path)
        const images = files.filter((file) => isImageFile(file.path))
        setImages(images)
        const index = images.findIndex((image) => image.path === path)
        setIndex(index > -1 ? index : 0)
        setLoading(false)
      } else {
        clearTimer()
        resetMode()
        document.fullscreenElement && document.exitFullscreen()
      }
    })()
  }, [clearTimer, forceMode, open, path, resetMode, resetTimer])

  const image = useMemo(() => images[index], [images, index])

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
                {image && (
                  <Typography
                    component="div"
                    sx={{ ml: 2, flex: 1 }}
                    variant="subtitle1"
                  >
                    {image.name}
                  </Typography>
                )}
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
              </Toolbar>
            </Box>
          </AppBar>
        </Fade>
      </Layout>
    </Dialog>
  )
}

export default PresentationDialog
