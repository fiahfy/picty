import {
  FocusEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { AutoSizer, Column, Table, TableCellProps } from 'react-virtualized'
import fileUrl from 'file-url'
import {
  Box,
  Divider,
  LinearProgress,
  Paper,
  Select,
  Typography,
  alpha,
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

const ExplorerGridList = (props: Props) => {
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
    const el = ref.current
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

  const chunks = useMemo(() => {
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
    switch (e.key) {
      case 'Enter':
        if (!e.nativeEvent.isComposing) {
          onKeyDownEnter(e)
        }
        return
      case 'ArrowUp':
        return
      case 'ArrowDown':
        return
    }
  }

  const handleFocus = (e: FocusEvent<HTMLDivElement>) => {
    const index = Number(e.target.getAttribute('aria-rowindex')) - 1
    if (index < 0) {
      return
    }
    // onFocusContent(rows[index])
  }

  const handleRowClick = (content: Row) => onClickContent(content)

  const handleRowDoubleClick = (content: Row) => onDoubleClickContent(content)

  const headerRenderer = () => {
    return (
      <Box sx={{ flexDirection: 'column', display: 'flex', height: '100%' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Select></Select>
        </Box>
        <Divider />
      </Box>
    )
  }

  const cellRenderer = ({ rowData }: TableCellProps) => {
    return (
      <Box sx={{ display: 'flex', height: '100%' }}>
        {Array(size)
          .fill(1)
          .map((_, i) => {
            const content = rowData[i]
            return (
              content && (
                <Paper
                  className={contentSelected(content) ? 'selected' : undefined}
                  elevation={1}
                  key={i}
                  onClick={() => handleRowClick(content)}
                  onDoubleClick={() => handleRowDoubleClick(content)}
                  sx={{
                    cursor: 'pointer',
                    m: 0.5,
                    overflow: 'hidden',
                    width: '33%',
                    '&:focus': {
                      outlineColor: (theme) => theme.palette.primary.main,
                      outlineOffset: '-1px',
                      outlineStyle: 'solid',
                      outlineWidth: '1px',
                    },
                    '&:hover': {
                      backgroundColor: (theme) => theme.palette.action.hover,
                    },
                    '&.selected': {
                      backgroundColor: (theme) =>
                        alpha(
                          theme.palette.primary.main,
                          theme.palette.action.selectedOpacity
                        ),
                      '&:hover': {
                        backgroundColor: (theme) =>
                          alpha(
                            theme.palette.primary.main,
                            theme.palette.action.selectedOpacity +
                              theme.palette.action.hoverOpacity
                          ),
                      },
                    },
                  }}
                  tabIndex={0}
                >
                  <Box
                    sx={{
                      flexDirection: 'column',
                      display: 'flex',
                      height: '100%',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={fileUrl(content.path)}
                      style={{
                        display: 'block',
                        flexGrow: 1,
                        minHeight: 0,
                        objectFit: 'cover',
                        objectPosition: 'center top',
                      }}
                    />
                    <Divider />
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        minHeight: (theme) => theme.spacing(5),
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
                          wordBreak: 'break-all',
                        }}
                        variant="caption"
                      >
                        {content.name}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}
                    >
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
                  </Box>
                </Paper>
              )
            )
          })}
      </Box>
    )
  }

  return (
    <Box
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      ref={ref}
      sx={{
        height: '100%',
        '.ReactVirtualized__Table__headerRow': {
          display: 'flex',
          '.ReactVirtualized__Table__headerColumn': {
            overflow: 'hidden',
          },
        },
        '.ReactVirtualized__Table__row': {
          '.ReactVirtualized__Table__rowColumn': {
            height: '100%',
          },
        },
      }}
    >
      <AutoSizer>
        {({ height, width }) => (
          <Table
            headerHeight={headerHeight}
            height={height}
            rowCount={chunks.length}
            rowGetter={({ index }) => chunks[index]}
            rowHeight={rowHeight}
            width={width}
          >
            <Column
              cellRenderer={cellRenderer}
              dataKey=""
              headerRenderer={headerRenderer}
              width={wrapperWidth}
            />
          </Table>
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

export default ExplorerGridList
