import {
  KeyboardEvent,
  MouseEvent,
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
  Popover,
  Slider,
  ToggleButton,
  Toolbar,
  Typography,
} from '@mui/material'
import {
  AspectRatio as AspectRatioIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Close as CloseIcon,
  Expand as ExpandIcon,
  FitScreen as FitScreenIcon,
} from '@mui/icons-material'
import FilledToggleButtonGroup from 'components/FilledToggleButtonGroup'
import Layout from 'components/Layout'
import { useTheme } from 'contexts/ThemeContext'
import { File } from 'interfaces'
import { useAppDispatch, useAppSelector } from 'store'
import {
  selectContentLayout,
  selectFullscreen,
  setContentLayout,
} from 'store/settings'
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

  const contentLayout = useAppSelector(selectContentLayout)
  const fullscreen = useAppSelector(selectFullscreen)
  const appDispatch = useAppDispatch()

  const [{ images, index, loading, title }, dispatch] = useReducer(reducer, {
    images: [],
    index: 0,
    loading: false,
    title: '',
  })
  const [toolbar, setToolbar] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const timer = useRef<number>()
  const wrapper = useRef<HTMLDivElement>(null)
  const topToolbar = useRef<HTMLDivElement>(null)
  const bottomToolbar = useRef<HTMLDivElement>(null)
  const popover = useRef<HTMLDivElement>(null)

  const clearTimer = useCallback(() => window.clearTimeout(timer.current), [])

  const resetTimer = useCallback(() => {
    setToolbar(true)
    clearTimer()
    const hovered =
      !!topToolbar.current?.querySelector(':hover') ||
      !!bottomToolbar.current?.querySelector(':hover') ||
      !!popover.current?.querySelector(':hover')
    if (hovered) {
      return
    }
    timer.current = window.setTimeout(() => {
      setToolbar(false)
      setAnchorEl(null)
    }, 2000)
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

  const ContentLayoutIcon = useMemo(() => {
    switch (contentLayout) {
      case 'default':
        return FitScreenIcon
      case 'aspectFit':
        return AspectRatioIcon
      case 'aspectFill':
        return ExpandIcon
    }
  }, [contentLayout])

  useEffect(() => {
    const el = wrapper.current
    if (!el) {
      return
    }
    el.scrollLeft = (el.scrollWidth - el.offsetWidth) / 2
    el.scrollTop = (el.scrollHeight - el.offsetHeight) / 2
  }, [contentLayout, image])

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

  const handleClickContentLayout = (e: MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(e.currentTarget)

  const handleClose = () => setAnchorEl(null)

  const handleChangeContentLayout = (
    _e: MouseEvent<HTMLElement>,
    value: 'default' | 'aspectFit' | 'aspectFill'
  ) => {
    appDispatch(setContentLayout(value))
    setAnchorEl(null)
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
        <Box
          ref={wrapper}
          sx={{ height: '100%', overflow: 'auto', width: '100%' }}
        >
          {image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={fileUrl(image.path)}
              style={{
                display: 'block',
                height: contentLayout !== 'aspectFill' ? '100%' : undefined,
                minHeight: contentLayout === 'aspectFill' ? '100%' : undefined,
                minWidth: contentLayout === 'aspectFill' ? '100%' : undefined,
                objectFit:
                  contentLayout === 'default' ? 'scale-down' : 'contain',
                width: contentLayout !== 'aspectFill' ? '100%' : undefined,
              }}
            />
          )}
        </Box>
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
                <Box sx={{ flexGrow: 1 }} />
                <IconButton
                  color="inherit"
                  edge="end"
                  onClick={handleClickContentLayout}
                >
                  <ContentLayoutIcon />
                </IconButton>
                <Popover
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                  onClose={handleClose}
                  open={!!anchorEl}
                  transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                >
                  <Box ref={popover}>
                    <FilledToggleButtonGroup
                      exclusive
                      onChange={handleChangeContentLayout}
                      size="small"
                      sx={{ m: 0.5 }}
                      value={contentLayout}
                    >
                      <ToggleButton title="Default" value="default">
                        <FitScreenIcon />
                      </ToggleButton>
                      <ToggleButton title="Aspect Fit" value="aspectFit">
                        <AspectRatioIcon />
                      </ToggleButton>
                      <ToggleButton title="Aspect Fill" value="aspectFill">
                        <ExpandIcon />
                      </ToggleButton>
                    </FilledToggleButtonGroup>
                  </Box>
                </Popover>
              </Toolbar>
            </Box>
          </AppBar>
        </Fade>
      </Layout>
    </Dialog>
  )
}

export default PresentationDialog
