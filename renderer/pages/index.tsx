import { ChangeEvent, KeyboardEvent, useEffect, useMemo, useState } from 'react'
import { RowMouseEventHandlerParams } from 'react-virtualized'
import { format } from 'date-fns'
import {
  Box,
  colors,
  Divider,
  FilledInput,
  IconButton,
  InputAdornment,
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
  InsertDriveFile as InsertDriveFileIcon,
  Search as SearchIcon,
} from '@mui/icons-material'
import Layout from 'components/Layout'
import VirtualizedTable, {
  RowFocusEventHandlerParams,
} from 'components/VirtualizedTable'
import { Content } from 'interfaces'
import { usePersistedState } from 'utils/PersistedStateContext'
import PresentationDialog from 'components/PresentationDialog'

const RoundedFilledInput = styled(FilledInput)(
  ({ endAdornment, startAdornment, theme }) => ({
    '&': {
      borderRadius: '40px',
      '::after': {
        display: 'none',
      },
      '::before': {
        display: 'none',
      },
      input: {
        ...(endAdornment ? {} : { paddingRight: theme.spacing(2.5) }),
        ...(startAdornment ? {} : { paddingLeft: theme.spacing(2.5) }),
      },
    },
  })
)

const IndexPage = () => {
  const [directory, setDirectory] = useState('')
  const [query, setQuery] = useState('')
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<string[]>([])
  const [dialogState, setDialogState] = useState<{
    open: boolean
    directory?: string
  }>({ open: false })

  const { state, setCurrentDirectory } = usePersistedState()

  useEffect(() => {
    ;(async () => {
      const directory =
        state.currentDirectory || (await window.electronAPI.getHomePath())
      setDirectory(directory)
      setContents([])
      setLoading(true)
      const contents = await window.electronAPI.listContents(directory)
      setContents(contents)
      setLoading(false)
    })()
  }, [state.currentDirectory])

  const filteredContents = useMemo(() => {
    return contents.filter((content) => !query || content.name.includes(query))
  }, [contents, query])

  const moveDirectory = (dirPath: string) => {
    setCurrentDirectory(dirPath)
  }

  const handleClickUpward = async () => {
    const dirPath = await window.electronAPI.getDirname(directory)
    setCurrentDirectory(dirPath)
  }

  const handleChangeDirectory = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setDirectory(value)
  }

  const handleKeyDownDirectory = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      setCurrentDirectory(directory)
    }
  }

  const handleChangeQuery = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setQuery(value)
  }

  const handleClickClose = () => {
    setQuery('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      setDialogState({ directory: selected[0], open: true })
    }
  }

  const handleRowClick = (info: RowMouseEventHandlerParams) => {
    setSelected([info.rowData.path])
  }

  const handleRowDoubleClick = (info: RowMouseEventHandlerParams) => {
    moveDirectory(info.rowData.path)
  }

  const handleRowFocus = (info: RowFocusEventHandlerParams) => {
    setSelected([info.rowData.path])
  }

  const handleRequestClose = () => {
    setDialogState({ open: false })
  }

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
          <IconButton color="inherit" disabled edge="start">
            <ArrowBackIcon />
          </IconButton>
          <IconButton color="inherit" disabled>
            <ArrowForwardIcon />
          </IconButton>
          <IconButton color="inherit" onClick={handleClickUpward}>
            <ArrowUpwardIcon />
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
                        onClick={handleClickClose}
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
                label: 'Name',
                dataKey: 'name',
              },
              {
                width: 200,
                label: 'Date Modified',
                dataKey: 'dateModified',
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
                  {row.type === 'directory' ? (
                    <FolderIcon sx={{ color: colors.blue['300'] }} />
                  ) : (
                    <InsertDriveFileIcon sx={{ color: colors.grey['400'] }} />
                  )}
                  <Typography noWrap sx={{ ml: 1 }} variant="body2">
                    {row.name}
                  </Typography>
                </Box>
              ),
              dateModified: format(row.dateModified, 'PP HH:mm'),
            })}
            rowSelected={(row) => selected.includes(row.path)}
            rows={filteredContents}
          />
        </Box>
      </Box>
      <PresentationDialog
        directory={dialogState.directory}
        onRequestClose={handleRequestClose}
        open={dialogState.open}
      />
    </Layout>
  )
}

export default IndexPage
