import {
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
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
import { useAppSelector } from 'store'
import { selectFullscreen } from 'store/settings'
import { isImageFile } from 'utils/image'

type State = { images: File[]; index: number; loading: boolean; title: string }

type Action =
  | {
      type: 'loaded'
      payload: { images: File[]; index: number; title: string }
    }
  | { type: 'loading' }
  | { type: 'moveNext' }
  | { type: 'movePrevious' }
  | { type: 'moveTo'; payload: number }
  | { type: 'reset' }

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'loaded':
      return {
        ...state,
        ...action.payload,
        loading: false,
      }
    case 'loading':
      return { ...state, images: [], index: 0, loading: true, title: '' }
    case 'moveNext': {
      let index = state.index + 1
      if (index > state.images.length - 1) {
        index = 0
      }
      return { ...state, index }
    }
    case 'movePrevious': {
      let index = state.index - 1
      if (index < 0) {
        index = state.images.length - 1
      }
      return { ...state, index }
    }
    case 'moveTo':
      return { ...state, index: action.payload }
    case 'reset':
      return { images: [], index: 0, loading: false, title: '' }
    default:
      return state
  }
}

type Props = {
  onRequestClose: () => void
  open: boolean
  path: string
}

const PresentationDialog = (props: Props) => {
  const { path, onRequestClose, open } = props

  const { forceMode, resetMode } = useTheme()

  const fullscreen = useAppSelector(selectFullscreen)

  const [{ images, index, loading, title }, dispatch] = useReducer(reducer, {
    images: [],
    index: 0,
    loading: false,
    title: '',
  })
  const [toolbar, setToolbar] = useState(false)
  const timer = useRef<number>()
  const topToolbar = useRef<HTMLDivElement>(null)
  const bottomToolbar = useRef<HTMLDivElement>(null)

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
    const handleFullscreenChange = () =>
      !document.fullscreenElement && onRequestClose()
    document.body.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.body.removeEventListener(
        'fullscreenchange',
        handleFullscreenChange
      )
    }
  }, [onRequestClose])

  useEffect(() => {
    ;(async () => {
      if (open) {
        dispatch({ type: 'loading' })
        fullscreen && (await document.body.requestFullscreen())
        forceMode('dark')
        resetTimer()
        try {
          const { files, title } = await window.electronAPI.getPresentationData(
            path
          )
          const images = files.filter((file) => isImageFile(file.path))
          const index = Math.max(
            0,
            images.findIndex((image) => image.path === path)
          )
          dispatch({ type: 'loaded', payload: { images, index, title } })
        } catch (e) {
          dispatch({ type: 'reset' })
        }
      } else {
        dispatch({ type: 'reset' })
        clearTimer()
        resetMode()
        document.fullscreenElement && (await document.exitFullscreen())
      }
    })()
  }, [clearTimer, forceMode, fullscreen, open, path, resetMode, resetTimer])

  const image = useMemo(() => images[index], [images, index])

  const movePrevious = () => dispatch({ type: 'movePrevious' })

  const moveNext = () => dispatch({ type: 'moveNext' })

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
      dispatch({ type: 'moveTo', payload: value })
    }
  }

  return (
    <Dialog
      fullScreen
      onClose={onRequestClose}
      onKeyDown={handleKeyDown}
      onMouseMove={handleMouseMove}
      open={open}
      sx={{ cursor: toolbar ? undefined : 'none' }}
      transitionDuration={0}
    >
      <Layout dialog>
        <Fade in={toolbar}>
          <AppBar color="transparent" elevation={0}>
            <Box
              sx={{
                background:
                  'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))',
                pb: 15,
              }}
            >
              <Toolbar ref={topToolbar} variant="dense">
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
                  {title}
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
        <Fade in={toolbar}>
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
              <Toolbar ref={bottomToolbar} variant="dense">
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
                <Typography
                  component="div"
                  noWrap
                  sx={{ flexShrink: 0, ml: 1 }}
                  variant="body1"
                >
                  {index + 1} / {images.length}
                </Typography>
                {image && (
                  <>
                    <Typography component="div" sx={{ ml: 1 }} variant="body1">
                      ・
                    </Typography>
                    <Typography
                      component="div"
                      noWrap
                      sx={{ ml: 1 }}
                      variant="body1"
                    >
                      {image.name}
                    </Typography>
                  </>
                )}
              </Toolbar>
            </Box>
          </AppBar>
        </Fade>
      </Layout>
    </Dialog>
  )
}

export default PresentationDialog
