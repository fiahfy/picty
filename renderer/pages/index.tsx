import {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { RowMouseEventHandlerParams } from 'react-virtualized'
import { format } from 'date-fns'
import {
  Box,
  colors,
  Divider,
  FilledInput,
  IconButton,
  InputAdornment,
  Rating,
  styled,
  Toolbar,
  Typography,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  Close as CloseIcon,
  Folder as FolderIcon,
  Home as HomeIcon,
  InsertDriveFile as InsertDriveFileIcon,
  Photo as PhotoIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
} from '@mui/icons-material'
import Layout from 'components/Layout'
import VirtualizedTable, {
  RowFocusEventHandlerParams,
} from 'components/VirtualizedTable'
import { Content } from 'interfaces'
import { useStore } from 'utils/StoreContext'
import PresentationDialog from 'components/PresentationDialog'
import { isImageFile } from 'utils/image'

const RoundedFilledInput = styled(FilledInput)({
  '&': {
    borderRadius: '40px',
    '::after': {
      display: 'none',
    },
    '::before': {
      display: 'none',
    },
  },
})

const StyledRating = styled(Rating)(({ theme }) => ({
  '& .MuiRating-iconFilled': {
    color: theme.palette.primary.main,
  },
  '& .MuiRating-iconHover': {
    color: theme.palette.primary.main,
  },
}))

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

  const { history, rating } = useStore()

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
        return history.push.call(null, homePath)
      }
      setDirectory(history.directory)
      await load()
    })()
  }, [history.directory, history.push, load])

  const adjustedContents = useMemo(() => {
    return contents
      .filter((content) => !query || content.name.includes(query))
      .map((content) => ({ ...content, rating: rating.isRating(content.path) }))
  }, [contents, query, rating])

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

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'Enter':
        if (!e.nativeEvent.isComposing) {
          setDialogState({ path: selected[0], open: true })
        }
        return
      case 'ArrowUp':
        return
      case 'ArrowDown':
        return
    }
  }

  const handleRowClick = (info: RowMouseEventHandlerParams) =>
    setSelected([info.rowData.path])

  const handleRowDoubleClick = (info: RowMouseEventHandlerParams) =>
    history.push(info.rowData.path)

  const handleRowFocus = (info: RowFocusEventHandlerParams) =>
    setSelected([info.rowData.path])

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
          <VirtualizedTable
            columns={[
              {
                dataKey: 'name',
                label: 'Name',
              },
              {
                dataKey: 'rating',
                label: 'Rating',
                width: 150,
                reverse: true,
              },
              {
                dataKey: 'dateModified',
                label: 'Date Modified',
                width: 200,
                reverse: true,
              },
            ]}
            loading={loading}
            onKeyDown={handleKeyDown}
            onRowClick={handleRowClick}
            onRowDoubleClick={handleRowDoubleClick}
            onRowFocus={handleRowFocus}
            rowRenderer={(row) => ({
              ...row,
              name: (
                <Box sx={{ alignItems: 'center', display: 'flex' }}>
                  {row.type === 'directory' && (
                    <FolderIcon sx={{ color: colors.blue['200'] }} />
                  )}
                  {row.type === 'file' &&
                    (isImageFile(row.path) ? (
                      <PhotoIcon sx={{ color: colors.green['200'] }} />
                    ) : (
                      <InsertDriveFileIcon sx={{ color: colors.grey['400'] }} />
                    ))}
                  <Typography noWrap sx={{ ml: 1 }} variant="body2">
                    {row.name}
                  </Typography>
                </Box>
              ),
              rating: (
                <StyledRating
                  color="primary"
                  onChange={(_e, value) => rating.rate(row.path, value ?? 0)}
                  precision={0.5}
                  value={row.rating}
                />
              ),
              dateModified: format(row.dateModified, 'PP HH:mm'),
            })}
            rowSelected={(row) => selected.includes(row.path)}
            rows={adjustedContents}
          />
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
