import {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  AppBar,
  Box,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  SelectChangeEvent,
  ToggleButton,
  Toolbar,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  Close as CloseIcon,
  Folder as FolderIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  Sort as SortIcon,
  StarBorder as StarBorderIcon,
  Star as StarIcon,
  TableRows as TableRowsIcon,
  ViewComfy as ViewComfyIcon,
  ViewSidebar as ViewSidebarIcon,
} from '@mui/icons-material'
import FilledToggleButtonGroup from 'components/FilledToggleButtonGroup'
import RoundedFilledInput from 'components/RoundedFilledInput'
import RoundedFilledSelect from 'components/RoundedFilledSelect'
import SettingsDialog from 'components/SettingsDialog'
import { useStore } from 'contexts/StoreContext'
import { useAppDispatch, useAppSelector } from 'store'
import { load, selectExplorer, setQuery, unselectAll } from 'store/explorer'
import {
  selectDrawerHidden,
  selectExplorerLayout,
  setDrawerHidden,
  setExplorerLayout,
} from 'store/settings'
import {
  push,
  selectCanBack,
  selectCanForward,
  selectCurrentDirectory,
} from 'store/history'
import { selectIsFavorite, toggle } from 'store/favorite'

const sortOptions = [
  { text: 'Name Ascending', value: 'name-asc' },
  { text: 'Name Descending', value: 'name-desc' },
  { text: 'Rating Ascending', value: 'rating-asc' },
  { text: 'Rating Descending', value: 'rating-desc' },
  { text: 'Date Modified Ascending', value: 'dateModified-asc' },
  { text: 'Date Modified Descending', value: 'dateModified-desc' },
]

const ExplorerBar = () => {
  const { sorting } = useStore()

  const { query } = useAppSelector(selectExplorer)
  const { canBack, canForward, currentDirectory } = useAppSelector((state) => ({
    canBack: selectCanBack(state),
    canForward: selectCanForward(state),
    currentDirectory: selectCurrentDirectory(state),
  }))
  const favorite = useAppSelector((state) =>
    selectIsFavorite(state)(currentDirectory)
  )
  const { drawerHidden, explorerLayout } = useAppSelector((state) => ({
    drawerHidden: selectDrawerHidden(state),
    explorerLayout: selectExplorerLayout(state),
  }))
  const dispatch = useAppDispatch()

  const [directory, setDirectory] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLInputElement>()

  useEffect(() => {
    const unsubscribe = window.electronAPI.subscribeShowSettings(() =>
      setOpen(true)
    )
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const unsubscribe = window.electronAPI.subscribeSearch(() => {
      dispatch(setQuery(document.getSelection()?.toString() ?? ''))
      ref.current && ref.current?.focus()
    })
    const handler = (e: globalThis.KeyboardEvent) => {
      if (
        e.key === 'f' &&
        ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey))
      ) {
        dispatch(setQuery(document.getSelection()?.toString() ?? ''))
        ref.current && ref.current?.focus()
      }
    }
    document.addEventListener('keydown', handler)
    return () => {
      document.removeEventListener('keydown', handler)
      unsubscribe()
    }
  }, [dispatch])

  const loadContents = useCallback(async () => {
    if (!currentDirectory) {
      return
    }
    dispatch(load(currentDirectory))
  }, [dispatch, currentDirectory])

  useEffect(() => {
    ;(async () => {
      if (!currentDirectory) {
        const homePath = await window.electronAPI.getHomePath()
        return dispatch(push(homePath))
      }
      setDirectory(currentDirectory)
      dispatch(unselectAll())
      await loadContents()
    })()
  }, [currentDirectory, dispatch, loadContents])

  const sortOption = useMemo(
    () => sorting.getOption(currentDirectory),
    [currentDirectory, sorting]
  )

  // click handlers
  const handleClickBack = () => history.back()

  const handleClickForward = () => history.forward()

  const handleClickUpward = async () => {
    const dirPath = await window.electronAPI.getDirname(directory)
    dispatch(push(dirPath))
  }

  const handleClickRefresh = async () => {
    setDirectory(currentDirectory)
    await loadContents()
  }

  const handleClickSettings = async () => setOpen(true)

  const handleClickFolder = async () =>
    await window.electronAPI.openPath(currentDirectory)

  const handleClickFavorite = () => dispatch(toggle(currentDirectory))

  const handleClickClearQuery = () => dispatch(setQuery(''))

  // change handlers
  const handleChangeDirectory = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setDirectory(value)
  }

  const handleChangeQuery = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    dispatch(setQuery(value))
  }

  const handleChangeViewSidebar = (
    _e: MouseEvent<HTMLElement>,
    value: 'sidebar'[]
  ) => dispatch(setDrawerHidden(!value.includes('sidebar')))

  const handleChangeExplorerLayout = (
    _e: MouseEvent<HTMLElement>,
    value: 'list' | 'thumbnail'
  ) => dispatch(setExplorerLayout(value))

  const handleChangeSortOption = (e: SelectChangeEvent) => {
    const [orderBy, order] = e.target.value.split('-') as [
      'name' | 'rating' | 'dateModified',
      'asc' | 'desc'
    ]
    sorting.sort(currentDirectory, { orderBy, order })
  }

  const handleKeyDownDirectory = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing && directory) {
      dispatch(push(directory))
    }
  }

  return (
    <AppBar
      color="default"
      component="div"
      elevation={0}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar disableGutters sx={{ minHeight: '32px!important', px: 1 }}>
        <IconButton
          color="inherit"
          disabled={!canBack}
          onClick={handleClickBack}
          size="small"
          sx={{ mr: 0.5 }}
          title="Go back"
        >
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <IconButton
          color="inherit"
          disabled={!canForward}
          onClick={handleClickForward}
          size="small"
          sx={{ mr: 0.5 }}
          title="Go forward"
        >
          <ArrowForwardIcon fontSize="small" />
        </IconButton>
        <IconButton
          color="inherit"
          onClick={handleClickUpward}
          size="small"
          sx={{ mr: 0.5 }}
          title="Go up"
        >
          <ArrowUpwardIcon fontSize="small" />
        </IconButton>
        <IconButton
          color="inherit"
          onClick={handleClickRefresh}
          size="small"
          title="Refresh"
        >
          <RefreshIcon fontSize="small" />
        </IconButton>
        <Box sx={{ display: 'flex', flexGrow: 1, mx: 1 }}>
          <Box sx={{ display: 'flex', flex: '2 1 0' }}>
            <RoundedFilledInput
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    color="inherit"
                    onClick={handleClickFavorite}
                    size="small"
                  >
                    {favorite ? (
                      <StarIcon fontSize="small" sx={{ color: '#faaf00' }} />
                    ) : (
                      <StarBorderIcon fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              }
              fullWidth
              hiddenLabel
              onChange={handleChangeDirectory}
              onKeyDown={handleKeyDownDirectory}
              size="small"
              spellCheck={false}
              startAdornment={
                <InputAdornment position="start">
                  <IconButton
                    color="inherit"
                    onClick={handleClickFolder}
                    size="small"
                  >
                    <FolderIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              }
              sx={{ mr: 0.5 }}
              value={directory}
            />
          </Box>
          <Box sx={{ display: 'flex', flex: '1 1 0' }}>
            <RoundedFilledInput
              endAdornment={
                query && (
                  <InputAdornment position="end">
                    <IconButton
                      color="inherit"
                      onClick={handleClickClearQuery}
                      size="small"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                )
              }
              fullWidth
              hiddenLabel
              inputRef={ref}
              onChange={handleChangeQuery}
              placeholder="Search..."
              size="small"
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              }
              sx={{ ml: 0.5 }}
              value={query}
            />
          </Box>
        </Box>
        <IconButton
          color="inherit"
          onClick={handleClickSettings}
          size="small"
          title="Settings"
        >
          <SettingsIcon fontSize="small" />
        </IconButton>
      </Toolbar>
      <Toolbar disableGutters sx={{ minHeight: '32px!important', px: 1 }}>
        <FilledToggleButtonGroup
          onChange={handleChangeViewSidebar}
          size="small"
          value={drawerHidden ? [] : ['sidebar']}
        >
          <ToggleButton
            sx={{ height: (theme) => theme.spacing(3.5), py: 0 }}
            title="Toggle Sidebar"
            value="sidebar"
          >
            <ViewSidebarIcon fontSize="small" />
          </ToggleButton>
        </FilledToggleButtonGroup>
        <div style={{ flexGrow: 1 }} />
        <FilledToggleButtonGroup
          exclusive
          onChange={handleChangeExplorerLayout}
          size="small"
          sx={{ mr: 1 }}
          value={explorerLayout}
        >
          <ToggleButton
            sx={{ height: (theme) => theme.spacing(3.5), py: 0 }}
            title="List View"
            value="list"
          >
            <TableRowsIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton
            sx={{ height: (theme) => theme.spacing(3.5), py: 0 }}
            title="Thumbnail View"
            value="thumbnail"
          >
            <ViewComfyIcon fontSize="small" />
          </ToggleButton>
        </FilledToggleButtonGroup>
        <RoundedFilledSelect
          onChange={handleChangeSortOption}
          startAdornment={
            <InputAdornment position="start">
              <SortIcon fontSize="small" />
            </InputAdornment>
          }
          value={`${sortOption.orderBy}-${sortOption.order}`}
        >
          {sortOptions.map((option, index) => (
            <MenuItem dense key={index} value={option.value}>
              {option.text}
            </MenuItem>
          ))}
        </RoundedFilledSelect>
      </Toolbar>
      <Divider />
      <SettingsDialog onRequestClose={() => setOpen(false)} open={open} />
    </AppBar>
  )
}

export default ExplorerBar
