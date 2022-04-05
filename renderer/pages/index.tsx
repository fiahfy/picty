import {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  Box,
  Divider,
  IconButton,
  InputAdornment,
  Toolbar,
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
} from '@mui/icons-material'
import ExplorerGridList from 'components/ExplorerGridList'
import ExplorerTable from 'components/ExplorerTable'
import Layout from 'components/Layout'
import PresentationDialog from 'components/PresentationDialog'
import RoundedFilledInput from 'components/RoundedFilledInput'
import { Content } from 'interfaces'
import { useStore } from 'utils/StoreContext'

const IndexPage = () => {
  const [directory, setDirectory] = useState('')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [contents, setContents] = useState<Content[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [dialogState, setDialogState] = useState<
    | {
        open: false
      }
    | { open: true; path: string }
  >({ open: false })

  const { history, settings, sorting } = useStore()

  useEffect(() => {
    window.electronAPI.onSearchText((_e, text) => {
      setQuery(text)
    })
  }, [])

  const load = useCallback(async () => {
    setContents([])
    setLoading(true)
    const contents = await window.electronAPI.listContents(history.directory)
    setContents(contents)
    setLoading(false)
  }, [history.directory])

  useEffect(() => {
    ;(async () => {
      if (!history.directory) {
        const homePath = await window.electronAPI.getHomePath()
        // @see https://github.com/facebook/react/issues/16265#issuecomment-1048648676
        return history.push.call(null, homePath)
      }
      setDirectory(history.directory)
      setSelected([])
      await load()
    })()
  }, [history.directory, history.push, load])

  const filteredContents = useMemo(
    () => contents.filter((content) => !query || content.name.includes(query)),
    [contents, query]
  )

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
    setQuery(value)
  }

  const handleClickClearQuery = () => setQuery('')

  const handleKeyDownEnter = () =>
    setDialogState({ path: selected[0], open: true })

  const handleChangeSortOption = (sortOption: {
    order: 'asc' | 'desc'
    orderBy: 'name' | 'rating' | 'dateModified'
  }) => {
    sorting.sort(history.directory, sortOption)
  }

  const handleClickContent = (content: Content) => {
    setSelected([content.path])
  }

  const handleDoubleClickContent = (content: Content) =>
    history.push(content.path)

  const handleFocusContent = (content: Content) => setSelected([content.path])

  const isContentSelected = (content: Content) =>
    selected.includes(content.path)

  const handleRequestClose = () => setDialogState({ open: false })

  return (
    <Layout>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
        }}
      >
        <Toolbar variant="dense">
          <IconButton
            color="inherit"
            disabled={!history.canBack}
            edge="start"
            onClick={handleClickBack}
          >
            <ArrowBackIcon />
          </IconButton>
          <IconButton
            color="inherit"
            disabled={!history.canForward}
            onClick={handleClickForward}
          >
            <ArrowForwardIcon />
          </IconButton>
          <IconButton color="inherit" onClick={handleClickUpward}>
            <ArrowUpwardIcon />
          </IconButton>
          <IconButton color="inherit" onClick={handleClickHome}>
            <HomeIcon />
          </IconButton>
          <IconButton color="inherit" onClick={handleClickRefresh}>
            <RefreshIcon />
          </IconButton>
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
                  <InputAdornment position="start" sx={{ mr: 0 }}>
                    <IconButton
                      color="inherit"
                      edge="start"
                      onClick={handleClickFolder}
                      sx={{ width: (theme) => theme.spacing(6) }}
                    >
                      <FolderIcon />
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
                onChange={handleChangeQuery}
                placeholder="Search..."
                size="small"
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                }
                sx={{ ml: 0.5 }}
                value={query}
              />
            </Box>
          </Box>
        </Toolbar>
        <Divider />
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          {settings.explorerLayout === 'list' ? (
            <ExplorerTable
              contentSelected={isContentSelected}
              contents={filteredContents}
              loading={loading}
              onChangeSortOption={handleChangeSortOption}
              onClickContent={handleClickContent}
              onDoubleClickContent={handleDoubleClickContent}
              onFocusContent={handleFocusContent}
              onKeyDownEnter={handleKeyDownEnter}
              sortOption={sortOption}
            />
          ) : (
            <ExplorerGridList
              contentSelected={isContentSelected}
              contents={filteredContents}
              loading={loading}
              onChangeSortOption={handleChangeSortOption}
              onClickContent={handleClickContent}
              onDoubleClickContent={handleDoubleClickContent}
              onFocusContent={handleFocusContent}
              onKeyDownEnter={handleKeyDownEnter}
              sortOption={sortOption}
            />
          )}
        </Box>
      </Box>
      {dialogState.open && (
        <PresentationDialog
          onRequestClose={handleRequestClose}
          open
          path={dialogState.path}
        />
      )}
    </Layout>
  )
}

export default IndexPage
