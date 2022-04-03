import {
  ComponentProps,
  FocusEvent,
  KeyboardEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  AutoSizer,
  Column,
  Table,
  TableCellProps,
  TableHeaderProps,
} from 'react-virtualized'
import {
  Box,
  TableCell,
  TableCellProps as MuiTableCellProps,
  TableSortLabel,
  alpha,
  LinearProgress,
  Divider,
  Select,
  Paper,
  Typography,
} from '@mui/material'

type ColumnData<T> = {
  dataKey: T
  label: string
  align?: MuiTableCellProps['align']
  width?: number
  reverse?: boolean
}

type Order = 'asc' | 'desc'

export type RowFocusEventHandlerParams = {
  rowData: any
  index: number
  event: FocusEvent<any>
}

type Props<K, T> = Pick<
  ComponentProps<typeof Table>,
  'onRowClick' | 'onRowDoubleClick'
> & {
  columns: ColumnData<K>[]
  headerHeight?: number
  loading?: boolean
  onChangeSortOption?: (sortOption: { order: Order; orderBy: K }) => void
  onKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void
  onRowFocus?: (info: RowFocusEventHandlerParams) => void
  rowHeight?: number
  rows: T[]
  rowRenderer?: (row: T) => ReactNode
  rowSelected?: (row: T) => boolean
  sortOption: { order: Order; orderBy: K }
}

const VirtualizedGridList = <
  K extends string,
  T extends { [key in K]: unknown }
>(
  props: Props<K, T>
) => {
  const {
    columns,
    headerHeight = 48,
    loading = false,
    onChangeSortOption,
    onKeyDown,
    onRowClick,
    onRowDoubleClick,
    onRowFocus,
    rowHeight = 256,
    rows,
    rowRenderer = (row) => row,
    rowSelected = () => false,
    sortOption,
  } = props

  const ref = useRef<HTMLDivElement>()
  const [wrapperWidth, setWrapperWidth] = useState(0)

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
    (a: T, b: T) => {
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
    [columns, sortOption]
  )

  const sortedRows = useMemo(
    () => rows.sort((a, b) => comparator(a, b)),
    [comparator, rows]
  )

  const handleFocus = (e: FocusEvent<HTMLDivElement>) => {
    const index = Number(e.target.getAttribute('aria-rowindex')) - 1
    if (index < 0) {
      return
    }
    onRowFocus && onRowFocus({ event: e, index, rowData: sortedRows[index] })
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown && onKeyDown(e)
  }

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

  const cellRenderer = ({ cellData, columnIndex }: TableCellProps) => {
    return (
      <Box sx={{ display: 'flex', height: '100%' }}>
        {[1, 1, 1].map((_, i) => (
          <Paper
            elevation={1}
            key={i}
            sx={{ m: 0.5, overflow: 'hidden', width: '33%' }}
          >
            <Box
              sx={{ flexDirection: 'column', display: 'flex', height: '100%' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src=""
                style={{
                  display: 'block',
                  flexGrow: 1,
                  minHeight: 0,
                  objectFit: 'cover',
                  objectPosition: 'center top',
                }}
              />
              <Divider />
              <Box sx={{ height: (theme) => theme.spacing(6) }}>
                <Typography align="center" variant="body2">
                  test.jpg
                </Typography>
              </Box>
            </Box>
          </Paper>
        ))}
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
          //   cursor: onRowClick ? 'pointer' : 'initial',
          //   display: 'flex',
          //   '&:hover': {
          //     backgroundColor: (theme) =>
          //       onRowClick ? theme.palette.action.hover : 'initial',
          //   },
          //   '&.selected': {
          //     backgroundColor: (theme) =>
          //       alpha(
          //         theme.palette.primary.main,
          //         theme.palette.action.selectedOpacity
          //       ),
          //     '&:hover': {
          //       backgroundColor: (theme) =>
          //         alpha(
          //           theme.palette.primary.main,
          //           theme.palette.action.selectedOpacity +
          //             theme.palette.action.hoverOpacity
          //         ),
          //     },
          //   },
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
            onRowClick={onRowClick}
            onRowDoubleClick={onRowDoubleClick}
            rowClassName={({ index }) => {
              // TODO: @see https://github.com/bvaughn/react-virtualized/issues/1357
              const row = sortedRows[index]
              return row && rowSelected(sortedRows[index]) ? 'selected' : ''
            }}
            rowCount={sortedRows.length}
            rowGetter={({ index }) => rowRenderer(sortedRows[index])}
            rowHeight={rowHeight}
            width={width}
          >
            <Column
              cellRenderer={cellRenderer}
              dataKey="dummykey"
              headerRenderer={headerRenderer}
              key="dummykey"
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

export default VirtualizedGridList
