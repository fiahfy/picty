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
import fileUrl from 'file-url'
import {
  Box,
  LinearProgress,
  Typography,
  ImageListItem,
  ImageListItemBar,
} from '@mui/material'
import Rating from 'components/Rating'
import { Content } from 'interfaces'
import { useStore } from 'utils/StoreContext'

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

const headerHeight = 48

const rowHeight = 256

const size = 3

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

  const { rating } = useStore()

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
  }, [comparator, contents, rating])

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

  const handleRowClick = (content: Row) => onClickContent(content)

  const handleRowDoubleClick = (content: Row) => onDoubleClickContent(content)

  const cellRenderer = ({ columnIndex, rowIndex, style }: GridCellProps) => {
    const content = rows[rowIndex][columnIndex]
    return (
      content && (
        <Box style={style} sx={{ p: 0.25 }}>
          <ImageListItem
            className={contentSelected(content) ? 'selected' : undefined}
            component="div"
            data-grid-column={columnIndex + 1}
            data-grid-row={rowIndex + 1}
            onClick={() => handleRowClick(content)}
            onDoubleClick={() => handleRowDoubleClick(content)}
            sx={{
              cursor: 'pointer',
              height: '100%!important',
              width: '100%',
              '&.selected': {
                outlineColor: (theme) => theme.palette.primary.main,
                // outlineOffset: '-1px',
                outlineStyle: 'solid',
                outlineWidth: '1px',
              },
              '&:focus': {
                outlineColor: (theme) => theme.palette.primary.main,
                // outlineOffset: '-2px',
                outlineStyle: 'solid',
                outlineWidth: '2px',
              },
            }}
            tabIndex={0}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fileUrl(content.path)}
              style={{ objectPosition: 'center top' }}
            />
            <ImageListItemBar
              // actionIcon={}
              subtitle={
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                  <Rating
                    color="primary"
                    onChange={(_e, value) =>
                      rating.setRating(content.path, value ?? 0)
                    }
                    precision={0.5}
                    size="small"
                    value={rating.getRating(content.path)}
                  />
                </Box>
              }
              sx={{ '.MuiImageListItemBar-titleWrap': { p: 0 } }}
              title={
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    height: (theme) => theme.spacing(5),
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    align="center"
                    sx={{
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 2,
                      display: '-webkit-box',
                      lineHeight: 1.4,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'initial',
                      wordBreak: 'break-all',
                    }}
                    variant="caption"
                  >
                    {content.name}
                  </Typography>
                </Box>
              }
            />
          </ImageListItem>
        </Box>
      )
    )
  }

  return (
    <Box
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      ref={ref}
      sx={{ height: '100%' }}
    >
      <AutoSizer>
        {({ height, width }) => (
          <Grid
            cellRenderer={cellRenderer}
            columnCount={size}
            columnWidth={width / size}
            height={height}
            rowCount={rows.length}
            rowHeight={rowHeight}
            width={width}
          />
        )}
      </AutoSizer>
      {loading && (
        <Box sx={{ marginTop: `${headerHeight}px`, width: '100%' }}>
          <LinearProgress />
        </Box>
      )}
    </Box>
  )
}

export default ExplorerGrid
