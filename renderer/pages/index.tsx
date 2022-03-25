import { ChangeEvent, KeyboardEvent, useEffect, useMemo, useState } from 'react'
import { RowMouseEventHandlerParams } from 'react-virtualized'
import { format } from 'date-fns'
import {
  Box,
  Divider,
  IconButton,
  InputAdornment,
  OutlinedInput,
  styled,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  Close as CloseIcon,
  Search as SearchIcon,
} from '@mui/icons-material'
import Layout from 'components/Layout'
import VirtualizedTable from 'components/VirtualizedTable'
import { usePersistedState } from 'utils/PersistedStateContext'

const RoundedOutlinedInput = styled(OutlinedInput)({
  fieldset: {
    borderRadius: '50px',
  },
})

const IndexPage = () => {
  const [directory, setDirectory] = useState('')
  const [query, setQuery] = useState('')
  const [contents, setContents] = useState([])

  const { state, setCurrentDirectory } = usePersistedState()

  useEffect(() => {
    ;(async () => {
      setDirectory(state.currentDirectory ?? '')
      if (state.currentDirectory) {
        const contents = await window.electronAPI.listContents(
          state.currentDirectory
        )
        setContents(contents)
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

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
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

  const handleRowDoubleClick = (info: RowMouseEventHandlerParams) => {
    moveDirectory(info.rowData.path)
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
          <IconButton disabled sx={{ mx: 0.5 }}>
            <ArrowBackIcon />
          </IconButton>
          <IconButton disabled sx={{ mx: 0.5 }}>
            <ArrowForwardIcon />
          </IconButton>
          <IconButton onClick={handleClickUpward} sx={{ mx: 0.5 }}>
            <ArrowUpwardIcon />
          </IconButton>
          <Box sx={{ display: 'flex', flexGrow: 1 }}>
            <Box sx={{ display: 'flex', flex: '2 1 0' }}>
              <RoundedOutlinedInput
                fullWidth
                onChange={handleChangeDirectory}
                onKeyDown={handleKeyDown}
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
                      <IconButton onClick={handleClickClose} size="small">
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
            onRowClick={() => undefined}
            onRowDoubleClick={handleRowDoubleClick}
            rowCount={filteredContents.length}
            rowGetter={({ index }) => {
              const content = filteredContents[index]
              return {
                ...content,
                dateModified: format(content.dateModified, 'PP HH:mm'),
              }
            }}
          />
        </Box>
      </Box>
    </Layout>
  )
}

export default IndexPage
