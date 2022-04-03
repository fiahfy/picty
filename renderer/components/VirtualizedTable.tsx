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

const VirtualizedTable = <K extends string, T extends { [key in K]: unknown }>(
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
    rowHeight = 48,
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

  const widths = useMemo(() => {
    const widths = columns.map((column) => column.width)
    const flexibleNum = widths.filter((width) => width === undefined).length
    if (flexibleNum === 0) {
      return widths
    }
    const sumWidth = widths.reduce<number>(
      (carry, width) => carry + (width ?? 0),
      0
    )
    const flexibleWidth = (wrapperWidth - sumWidth) / flexibleNum
    return widths.map((width) => (width === undefined ? flexibleWidth : width))
  }, [columns, wrapperWidth])

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

  const handleClickHeaderCell = (dataKey: K) => {
    const isAsc = sortOption.orderBy === dataKey && sortOption.order === 'asc'
    onChangeSortOption &&
      onChangeSortOption({ order: isAsc ? 'desc' : 'asc', orderBy: dataKey })
  }

  const headerRenderer = ({
    label,
    columnIndex,
  }: TableHeaderProps & { columnIndex: number }) => {
    const column = columns[columnIndex]
    return (
      <TableCell
        align={column.align}
        component="div"
        sortDirection={
          sortOption.orderBy === column.dataKey ? sortOption.order : false
        }
        sx={{
          alignItems: 'center',
          display: 'flex',
          height: headerHeight,
          py: 0,
        }}
        variant="head"
      >
        <TableSortLabel
          active={sortOption.orderBy === column.dataKey}
          direction={
            sortOption.orderBy === column.dataKey ? sortOption.order : 'asc'
          }
          onClick={() => handleClickHeaderCell(column.dataKey)}
          sx={{ width: '100%' }}
        >
          <Box
            component="span"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </Box>
        </TableSortLabel>
      </TableCell>
    )
  }

  const cellRenderer = ({ cellData, columnIndex }: TableCellProps) => {
    return (
      <TableCell
        align={columns[columnIndex].align}
        component="div"
        sx={{
          alignItems: 'center',
          display: 'flex',
          height: rowHeight,
          py: 0,
        }}
        variant="body"
      >
        <Box
          component="span"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {cellData}
        </Box>
      </TableCell>
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
          cursor: onRowClick ? 'pointer' : 'initial',
          display: 'flex',
          '&:hover': {
            backgroundColor: (theme) =>
              onRowClick ? theme.palette.action.hover : 'initial',
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
            {columns.map(({ dataKey, ...others }, index) => {
              return (
                <Column
                  {...others}
                  cellRenderer={cellRenderer}
                  dataKey={dataKey}
                  headerRenderer={(headerProps) =>
                    headerRenderer({
                      ...headerProps,
                      columnIndex: index,
                    })
                  }
                  key={dataKey}
                  width={widths[index] ?? 0}
                />
              )
            })}
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

export default VirtualizedTable
