import { ChangeEvent, KeyboardEvent, useEffect, useMemo, useState } from 'react'
import { RowMouseEventHandlerParams } from 'react-virtualized'
import { format } from 'date-fns'
import {
  Box,
  colors,
  Divider,
  IconButton,
  InputAdornment,
  OutlinedInput,
  styled,
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

const RoundedOutlinedInput = styled(OutlinedInput)({
  fieldset: {
    borderRadius: '50px',
  },
})

const IndexPage = () => {
  const [directory, setDirectory] = useState('')
  const [query, setQuery] = useState('')
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<string[]>([])
  const [open, setOpen] = useState(false)

  const { state, setCurrentDirectory } = usePersistedState()

  useEffect(() => {
    ;(async () => {
      setDirectory(state.currentDirectory ?? '')
      if (state.currentDirectory) {
        setLoading(true)
        setContents([])
        const contents = await window.electronAPI.listContents(
          state.currentDirectory
        )
        setContents(contents)
        setLoading(false)
      }
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
      setOpen(true)
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
        <Box sx={{ display: 'flex', flexShrink: 0, p: 0.5 }}>
          <IconButton color="inherit" disabled sx={{ mx: 0.5 }}>
            <ArrowBackIcon />
          </IconButton>
          <IconButton color="inherit" disabled sx={{ mx: 0.5 }}>
            <ArrowForwardIcon />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={handleClickUpward}
            sx={{ mx: 0.5 }}
          >
            <ArrowUpwardIcon />
          </IconButton>
          <Box sx={{ display: 'flex', flexGrow: 1 }}>
            <Box sx={{ display: 'flex', flex: '2 1 0' }}>
              <RoundedOutlinedInput
                fullWidth
                onChange={handleChangeDirectory}
                onKeyDown={handleKeyDownDirectory}
                size="small"
                spellCheck={false}
                sx={{ mx: 0.5 }}
                value={directory}
              />
            </Box>
            <Box sx={{ display: 'flex', flex: '1 1 0' }}>
              <RoundedOutlinedInput
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
                onChange={handleChangeQuery}
                placeholder="Search..."
                size="small"
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                }
                sx={{ mx: 0.5 }}
                value={query}
              />
            </Box>
          </Box>
        </Box>
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
      <PresentationDialog onRequestClose={() => setOpen(false)} open={open} />
    </Layout>
  )
}

export default IndexPage
