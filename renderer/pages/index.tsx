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
import { KeyboardEvent, useEffect, useMemo, useState } from 'react'
import usePersistedState from 'hooks/usePersistedState'
import { RowMouseEventHandlerParams } from 'react-virtualized'
import { format } from 'date-fns'

const RoundedOutlinedInput = styled(OutlinedInput)({
  fieldset: {
    borderRadius: '50px',
  },
})

const IndexPage = () => {
  const [currentDirectory, setCurrentDirectory] = useState('')
  const [query, setQuery] = useState('')
  const [contents, setContents] = useState([])

  const [state, setState] = usePersistedState()

  useEffect(() => {
    ;(async () => {
      setCurrentDirectory(state.currentDirectory ?? '')
      if (state.currentDirectory) {
        const contents = await window.electronAPI.listContents(
          state.currentDirectory
        )
        setContents(contents)
      }
    })()
  }, [state])

  const filteredContents = useMemo(() => {
    return contents.filter((content) => !query || content.name.includes(query))
  }, [contents, query])

  const moveDirectory = (dirPath: string) => {
    setState({ currentDirectory: dirPath })
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      setState({ currentDirectory })
    }
  }

  const handleClickUpward = async () => {
    const dir = await window.electronAPI.getDirname(currentDirectory)
    setState({ currentDirectory: dir })
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
        <Box sx={{ display: 'flex', flexShrink: 0, py: 0.5 }}>
          <IconButton sx={{ mx: 0.5 }}>
            <ArrowBackIcon />
          </IconButton>
          <IconButton sx={{ mx: 0.5 }}>
            <ArrowForwardIcon />
          </IconButton>
          <IconButton onClick={handleClickUpward} sx={{ mx: 0.5 }}>
            <ArrowUpwardIcon />
          </IconButton>
          <Box sx={{ display: 'flex', flexGrow: 1, mx: 0.5 }}>
            <RoundedOutlinedInput
              fullWidth
              onChange={(e) => {
                const value = e.currentTarget.value
                setCurrentDirectory(value)
              }}
              onKeyDown={handleKeyDown}
              size="small"
              sx={{ flex: 2, mx: 0.5 }}
              value={currentDirectory}
            />
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
              onChange={(e) => {
                const value = e.currentTarget.value
                setQuery(value)
              }}
              placeholder="Search..."
              size="small"
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
              sx={{ flex: 1, mx: 0.5 }}
              value={query}
            />
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
