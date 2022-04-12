import {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  AppBar,
  Box,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  ToggleButton,
  Toolbar,
  Tooltip,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  Close as CloseIcon,
  Folder as FolderIcon,
  Home as HomeIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Sort as SortIcon,
  TableRows as TableRowsIcon,
  ViewComfy as ViewComfyIcon,
} from '@mui/icons-material'
import FilledToggleButtonGroup from 'components/FilledToggleButtonGroup'
import RoundedFilledInput from 'components/RoundedFilledInput'
import { useStore } from 'utils/StoreContext'

const sortOptions = [
  { text: 'Name Ascending', value: 'name-asc' },
  { text: 'Name Descending', value: 'name-desc' },
  { text: 'Rating Ascending', value: 'rating-asc' },
  { text: 'Rating Descending', value: 'rating-desc' },
  { text: 'Date Modified Ascending', value: 'dateModified-asc' },
  { text: 'Date Modified Descending', value: 'dateModified-desc' },
]

const ExplorerBar = () => {
  const [directory, setDirectory] = useState('')
  const { explorer, history, settings, sorting } = useStore()

  useEffect(() => {
    const unsubscribe = window.electronAPI.subscribeSearchText((text) => {
      explorer.setQuery.call(null, text)
    })
    return () => unsubscribe()
  }, [explorer.setQuery])

  const load = useCallback(async () => {
    // @see https://github.com/facebook/react/issues/16265#issuecomment-1048648676
    explorer.setContents.call(null, [])
    explorer.setLoading.call(null, true)
    const contents = await window.electronAPI.listContents(history.directory)
    explorer.setContents.call(null, contents)
    explorer.setLoading.call(null, false)
  }, [explorer.setContents, explorer.setLoading, history.directory])

  useEffect(() => {
    ;(async () => {
      if (!history.directory) {
        const homePath = await window.electronAPI.getHomePath()
        return history.push.call(null, homePath)
      }
      setDirectory(history.directory)
      explorer.setSelected.call(null, [])
      await load()
    })()
  }, [explorer.setSelected, history.directory, history.push, load])

  const sortOption = useMemo(
    () => sorting.getOption(history.directory),
    [history.directory, sorting]
  )

  const handleClickBack = () => history.back()

  const handleClickForward = () => history.forward()

  const handleClickUpward = async () => {
    const dirPath = await window.electronAPI.getDirname(directory)
    history.push(dirPath)
  }

  const handleClickHome = async () => {
    const homePath = await window.electronAPI.getHomePath()
    history.push(homePath)
  }

  const handleClickRefresh = load

  const handleClickFolder = async () => {
    await window.electronAPI.openPath(history.directory)
  }

  const handleChangeDirectory = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setDirectory(value)
  }

  const handleKeyDownDirectory = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      history.push(directory)
    }
  }

  const handleChangeQuery = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    explorer.setQuery(value)
  }

  const handleClickClearQuery = () => explorer.setQuery('')

  const handleChangeExplorerLayout = (
    _e: MouseEvent<HTMLElement>,
    value: 'list' | 'thumbnail'
  ) => settings.setExplorerLayout(value)

  const handleChangeSortOption = (e: SelectChangeEvent) => {
    const [orderBy, order] = e.target.value.split('-') as [
      'name' | 'rating' | 'dateModified',
      'asc' | 'desc'
    ]
    sorting.sort(history.directory, { orderBy, order })
  }

  return (
    <AppBar
      color="default"
      component="div"
      elevation={0}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar disableGutters sx={{ minHeight: '32px!important', px: 1 }}>
        <Tooltip title="Go back">
          <IconButton
            color="inherit"
            disabled={!history.canBack}
            onClick={handleClickBack}
            size="small"
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Go forward">
          <IconButton
            color="inherit"
            disabled={!history.canForward}
            onClick={handleClickForward}
            size="small"
          >
            <ArrowForwardIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Go up">
          <IconButton color="inherit" onClick={handleClickUpward} size="small">
            <ArrowUpwardIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Go home">
          <IconButton color="inherit" onClick={handleClickHome} size="small">
            <HomeIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Refresh">
          <IconButton color="inherit" onClick={handleClickRefresh} size="small">
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Box sx={{ display: 'flex', flexGrow: 1, ml: 1 }}>
          <Box sx={{ display: 'flex', flex: '2 1 0' }}>
            <RoundedFilledInput
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
                explorer.query && (
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
              onChange={handleChangeQuery}
              placeholder="Search..."
              size="small"
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              }
              sx={{ ml: 0.5 }}
              value={explorer.query}
            />
          </Box>
        </Box>
      </Toolbar>
      <Toolbar disableGutters sx={{ minHeight: '32px!important', px: 1 }}>
        <div style={{ flexGrow: 1 }} />
        <FilledToggleButtonGroup
          exclusive
          onChange={handleChangeExplorerLayout}
          size="small"
          sx={{ mr: 1 }}
          value={settings.explorerLayout}
        >
          <ToggleButton
            sx={{ height: (theme) => theme.spacing(3.5), py: 0 }}
            value="list"
          >
            <Tooltip title="List View">
              <TableRowsIcon fontSize="small" />
            </Tooltip>
          </ToggleButton>
          <ToggleButton
            sx={{ height: (theme) => theme.spacing(3.5), py: 0 }}
            value="thumbnail"
          >
            <Tooltip title="Thumbnail View">
              <ViewComfyIcon fontSize="small" />
            </Tooltip>
          </ToggleButton>
        </FilledToggleButtonGroup>
        <Select
          onChange={handleChangeSortOption}
          startAdornment={
            <InputAdornment position="start">
              <SortIcon fontSize="small" />
            </InputAdornment>
          }
          sx={{
            '&': {
              borderRadius: (theme) => theme.spacing(4),
              '::after': {
                display: 'none',
              },
              '::before': {
                display: 'none',
              },
              '.MuiSelect-select': {
                background: 'none',
                py: (theme) => theme.spacing(0.5),
                typography: 'body2',
              },
            },
          }}
          value={`${sortOption.orderBy}-${sortOption.order}`}
          variant="filled"
        >
          {sortOptions.map((option, index) => (
            <MenuItem dense key={index} value={option.value}>
              {option.text}
            </MenuItem>
          ))}
        </Select>
      </Toolbar>
      <Divider />
    </AppBar>
  )
}

export default ExplorerBar
