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
  Container,
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
} from '@mui/icons-material'
import Layout from 'components/Layout'
import { Content } from 'interfaces'
import { useTheme } from 'utils/ThemeContext'

type Props = {
  directory?: string
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

  const content = useMemo(() => contents[index], [contents, index])

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
      if (open) {
        forceMode('dark')
        resetTimer()
        setIndex(0)
        setContents([])
        if (!directory) {
          return
        }
        setLoading(true)
        const contents = await window.electronAPI.listContents(directory)
        setContents(contents)
        setLoading(false)
      }
    })()
    return () => {
      clearTimer()
      resetMode()
    }
  }, [directory, forceMode, open, resetMode, resetTimer])

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
    resetTimer()
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        return movePrevious()
      case 'ArrowRight':
      case 'ArrowDown':
        return moveNext()
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
                <IconButton color="inherit" edge="end">
                  <FullscreenIcon />
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
