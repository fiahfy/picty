import {
  FocusEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { AutoSizer, Grid, GridCellProps } from 'react-virtualized'
import {
  Box,
  LinearProgress,
  Select,
  MenuItem,
  SelectChangeEvent,
  Toolbar,
  InputAdornment,
} from '@mui/material'
import { Sort as SortIcon } from '@mui/icons-material'
import { Content } from 'interfaces'
import { useStore } from 'utils/StoreContext'
import ExplorerGridItem from './ExplorerGlidItem'

const columns = [
  {
    dataKey: 'name',
  },
  {
    dataKey: 'rating',
    reverse: true,
  },
  {
    dataKey: 'dateModified',
    reverse: true,
  },
]

const sortOptions = [
  { text: 'Name Ascending', value: 'name-asc' },
  { text: 'Name Descending', value: 'name-desc' },
  { text: 'Rating Ascending', value: 'rating-asc' },
  { text: 'Rating Descending', value: 'rating-desc' },
  { text: 'Date Modified Ascending', value: 'dateModified-asc' },
  { text: 'Date Modified Descending', value: 'dateModified-desc' },
]

const headerHeight = 32

const rowHeight = 256

type Order = 'asc' | 'desc'

type Row = Content & { rating: number }

type Props = {
  contents: Content[]
  loading: boolean
  onChangeSortOption: (sortOption: {
    order: Order
    orderBy: 'name' | 'rating' | 'dateModified'
  }) => void
  onClickContent: (content: Content) => void
  onDoubleClickContent: (content: Content) => void
  onFocusContent: (content: Content) => void
  onKeyDownEnter: (e: KeyboardEvent<HTMLDivElement>) => void
  contentSelected: (content: Content) => boolean
  sortOption: { order: Order; orderBy: 'name' | 'rating' | 'dateModified' }
}

const ExplorerGrid = (props: Props) => {
  const {
    contents,
    loading,
    onChangeSortOption,
    onClickContent,
    onDoubleClickContent,
    onFocusContent,
    onKeyDownEnter,
    contentSelected,
    sortOption,
  } = props

  const ref = useRef<HTMLDivElement>()
  const [wrapperWidth, setWrapperWidth] = useState(0)

  const { rating } = useStore()

  useEffect(() => {
    const el = ref.current?.querySelector('.ReactVirtualized__Grid')
    if (!el) {
      return
    }
    const handleResize = (entries: ResizeObserverEntry[]) => {
      const entry = entries[0]
      if (entry) {
        setWrapperWidth(entry.contentRect.width)
      }
    }
    const observer = new ResizeObserver(handleResize)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const size = useMemo(
    () => Math.ceil(wrapperWidth / rowHeight) || 1,
    [wrapperWidth]
  )

  const comparator = useCallback(
    (a: Row, b: Row) => {
      let result = 0
      const aValue = a[sortOption.orderBy]
      const bValue = b[sortOption.orderBy]
      if (aValue !== undefined && bValue !== undefined) {
        if (aValue > bValue) {
          result = 1
        } else if (aValue < bValue) {
          result = -1
        }
      } else {
        result = 0
      }
      const orderSign = sortOption.order === 'desc' ? -1 : 1
      const reverseSign = columns.find(
        (column) => column.dataKey === sortOption.orderBy
      )?.reverse
        ? -1
        : 1
      return orderSign * reverseSign * result
    },
    [sortOption]
  )

  const rows = useMemo(() => {
    const sorted = contents
      .map((content) => ({
        ...content,
        rating: rating.getRating(content.path),
      }))
      .sort((a, b) => comparator(a, b))
    return sorted.reduce(
      (carry, _, i) =>
        i % size ? carry : [...carry, sorted.slice(i, i + size)],
      [] as Row[][]
    )
  }, [comparator, contents, rating, size])

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const row = Number(document.activeElement?.getAttribute('data-grid-row'))
    const column = Number(
      document.activeElement?.getAttribute('data-grid-column')
    )
    switch (e.key) {
      case 'Enter':
        if (!e.nativeEvent.isComposing) {
          onKeyDownEnter(e)
        }
        return
      case 'ArrowUp': {
        const el = ref.current?.querySelector<HTMLDivElement>(
          `[data-grid-row="${row - 1}"][data-grid-column="${column}"]`
        )
        el && el.focus()
        break
      }
      case 'ArrowDown': {
        const el = ref.current?.querySelector<HTMLDivElement>(
          `[data-grid-row="${row + 1}"][data-grid-column="${column}"]`
        )
        el && el.focus()
        break
      }
      case 'ArrowLeft': {
        const el = ref.current?.querySelector<HTMLDivElement>(
          `[data-grid-row="${row}"][data-grid-column="${column - 1}"]`
        )
        el && el.focus()
        break
      }
      case 'ArrowRight': {
        const el = ref.current?.querySelector<HTMLDivElement>(
          `[data-grid-row="${row}"][data-grid-column="${column + 1}"]`
        )
        el && el.focus()
        break
      }
    }
  }

  const handleFocus = (e: FocusEvent<HTMLDivElement>) => {
    const rowIndex = Number(e.target.getAttribute('data-grid-row')) - 1
    const columnIndex = Number(e.target.getAttribute('data-grid-column')) - 1
    if (rowIndex < 0 || columnIndex < 0) {
      return
    }
    onFocusContent(rows[rowIndex][columnIndex])
  }

  const handleChange = (e: SelectChangeEvent) => {
    const [orderBy, order] = e.target.value.split('-') as [
      'name' | 'rating' | 'dateModified',
      Order
    ]
    onChangeSortOption({ orderBy, order })
  }

  const handleRowClick = (content: Row) => onClickContent(content)

  const handleRowDoubleClick = (content: Row) => onDoubleClickContent(content)

  const cellRenderer = ({
    columnIndex,
    key,
    rowIndex,
    style,
  }: GridCellProps) => {
    const content = rows[rowIndex][columnIndex]
    return (
      content && (
        <Box key={key} style={style} sx={{ p: 0.25 }}>
          <ExplorerGridItem
            columnIndex={columnIndex}
            content={content}
            onClick={() => handleRowClick(content)}
            onDoubleClick={() => handleRowDoubleClick(content)}
            rowIndex={rowIndex}
            selected={contentSelected(content)}
          />
        </Box>
      )
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar
        disableGutters
        sx={{ minHeight: `${headerHeight}px!important`, px: 1 }}
      >
        <div style={{ flexGrow: 1 }} />
        <Select
          onChange={handleChange}
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
      {loading && <LinearProgress />}
      <Box
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        ref={ref}
        sx={{ flexGrow: 1 }}
      >
        <AutoSizer>
          {({ height, width }) => (
            <Grid
              cellRenderer={cellRenderer}
              columnCount={size}
              columnWidth={wrapperWidth / size}
              height={height}
              rowCount={rows.length}
              rowHeight={rowHeight}
              width={width}
            />
          )}
        </AutoSizer>
      </Box>
    </Box>
  )
}

export default ExplorerGrid
