import {
  ChangeEvent,
  createElement,
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
import ExplorerGrid from 'components/ExplorerGrid'
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
    const unsubscribe = window.electronAPI.subscribeSearchText((text) => {
      setQuery(text ?? window.getSelection()?.toString() ?? '')
    })
    return () => unsubscribe()
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
        <Toolbar disableGutters sx={{ minHeight: '32px!important', px: 1 }}>
          <IconButton
            color="inherit"
            disabled={!history.canBack}
            onClick={handleClickBack}
            size="small"
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <IconButton
            color="inherit"
            disabled={!history.canForward}
            onClick={handleClickForward}
            size="small"
          >
            <ArrowForwardIcon fontSize="small" />
          </IconButton>
          <IconButton color="inherit" onClick={handleClickUpward} size="small">
            <ArrowUpwardIcon fontSize="small" />
          </IconButton>
          <IconButton color="inherit" onClick={handleClickHome} size="small">
            <HomeIcon fontSize="small" />
          </IconButton>
          <IconButton color="inherit" onClick={handleClickRefresh} size="small">
            <RefreshIcon fontSize="small" />
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
        </Toolbar>
        <Divider />
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          {createElement(
            settings.explorerLayout === 'list' ? ExplorerTable : ExplorerGrid,
            {
              contentSelected: isContentSelected,
              contents: filteredContents,
              loading,
              onChangeSortOption: handleChangeSortOption,
              onClickContent: handleClickContent,
              onDoubleClickContent: handleDoubleClickContent,
              onFocusContent: handleFocusContent,
              onKeyDownEnter: handleKeyDownEnter,
              sortOption,
            }
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
