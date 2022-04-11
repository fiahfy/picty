import { FocusEvent, KeyboardEvent, useCallback, useRef } from 'react'
import {
  AutoSizer,
  Column,
  RowMouseEventHandlerParams,
  Table,
  TableCellProps,
  TableHeaderProps,
} from 'react-virtualized'
import { format } from 'date-fns'
import {
  Box,
  LinearProgress,
  TableCell,
  TableSortLabel,
  Typography,
  alpha,
} from '@mui/material'
import ExplorerItemIcon from 'components/ExplorerItemIcon'
import ExplorerItemRating from 'components/ExplorerItemRating'
import { Item } from 'interfaces'
import { useStore } from 'utils/StoreContext'

const headerHeight = 32
const rowHeight = 32

type Key = 'name' | 'rating' | 'dateModified'
type Order = 'asc' | 'desc'

type ColumnType = {
  defaultOrder?: Order
  key: Key
  label: string
  width?: number
}

const columns: ColumnType[] = [
  {
    key: 'name',
    label: 'Name',
  },
  {
    defaultOrder: 'desc',
    key: 'rating',
    label: 'Rating',
    width: 128,
  },
  {
    defaultOrder: 'desc',
    key: 'dateModified',
    label: 'Date Modified',
    width: 160,
  },
]

type Props = {
  itemSelected: (item: Item) => boolean
  items: Item[]
  loading: boolean
  onChangeSortOption: (sortOption: { order: Order; orderBy: Key }) => void
  onClickItem: (item: Item) => void
  onDoubleClickItem: (item: Item) => void
  onFocusItem: (item: Item) => void
  onKeyDownEnter: (e: KeyboardEvent<HTMLDivElement>) => void
  sortOption: { order: Order; orderBy: Key }
}

const ExplorerTable = (props: Props) => {
  const {
    itemSelected,
    items,
    loading,
    onChangeSortOption,
    onClickItem,
    onDoubleClickItem,
    onFocusItem,
    onKeyDownEnter,
    sortOption,
  } = props

  const ref = useRef<HTMLDivElement>()

  const { rating } = useStore()

  const getWidths = useCallback((wrapperWidth) => {
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
  }, [])

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const row = Number(document.activeElement?.getAttribute('aria-rowindex'))
    switch (e.key) {
      case 'Enter':
        if (!e.nativeEvent.isComposing) {
          onKeyDownEnter(e)
        }
        break
      case 'ArrowUp': {
        const el = ref.current?.querySelector<HTMLDivElement>(
          `[aria-rowindex="${row - 1}"]`
        )
        el && el.focus()
        break
      }
      case 'ArrowDown': {
        const el = ref.current?.querySelector<HTMLDivElement>(
          `[aria-rowindex="${row + 1}"]`
        )
        el && el.focus()
        break
      }
    }
  }

  const handleFocus = (e: FocusEvent<HTMLDivElement>) => {
    const index = Number(e.target.getAttribute('aria-rowindex')) - 1
    if (index < 0) {
      return
    }
    onFocusItem(items[index])
  }

  const handleRowClick = (info: RowMouseEventHandlerParams) =>
    onClickItem(info.rowData)

  const handleRowDoubleClick = (info: RowMouseEventHandlerParams) =>
    onDoubleClickItem(info.rowData)

  const headerRenderer = ({ dataKey, label }: TableHeaderProps) => {
    return (
      <TableCell
        component="div"
        sortDirection={
          sortOption.orderBy === dataKey ? sortOption.order : false
        }
        sx={{
          alignItems: 'center',
          borderBottom: 'none',
          display: 'flex',
          height: headerHeight,
          py: 0,
        }}
        variant="head"
      >
        <TableSortLabel
          active={sortOption.orderBy === dataKey}
          direction={sortOption.orderBy === dataKey ? sortOption.order : 'asc'}
          onClick={() => {
            const defaultOrder =
              columns.find((column) => column.key === dataKey)?.defaultOrder ??
              'asc'
            const reverseSign =
              sortOption.orderBy === dataKey &&
              sortOption.order === defaultOrder
                ? -1
                : 1
            const defaultSign = defaultOrder === 'asc' ? 1 : -1
            onChangeSortOption({
              order: defaultSign * reverseSign === 1 ? 'asc' : 'desc',
              orderBy: dataKey as Key,
            })
          }}
        >
          <Box
            component="span"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <Typography noWrap variant="caption">
              {label}
            </Typography>
          </Box>
        </TableSortLabel>
      </TableCell>
    )
  }

  const cellRenderer = ({ dataKey, rowData }: TableCellProps) => {
    return (
      <TableCell
        component="div"
        sx={{
          alignItems: 'center',
          borderBottom: 'none',
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
          {
            {
              name: (
                <Box sx={{ alignItems: 'center', display: 'flex' }}>
                  <ExplorerItemIcon item={rowData} size="small" />
                  <Typography
                    noWrap
                    sx={{ ml: 1 }}
                    title={rowData.name}
                    variant="caption"
                  >
                    {rowData.name}
                  </Typography>
                </Box>
              ),
              rating: (
                <Box sx={{ display: 'flex' }}>
                  <ExplorerItemRating
                    color="primary"
                    onChange={(_e, value) =>
                      rating.setRating(rowData.path, value ?? 0)
                    }
                    precision={0.5}
                    size="small"
                    value={rating.getRating(rowData.path)}
                  />
                </Box>
              ),
              dateModified: (
                <Typography noWrap variant="caption">
                  {format(rowData.dateModified, 'PP HH:mm')}
                </Typography>
              ),
            }[dataKey]
          }
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
          cursor: 'pointer',
          display: 'flex',
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
        },
      }}
    >
      <AutoSizer>
        {({ height, width }) => {
          const widths = getWidths(width)
          return (
            <Table
              headerHeight={headerHeight}
              height={height}
              onRowClick={handleRowClick}
              onRowDoubleClick={handleRowDoubleClick}
              rowClassName={({ index }) => {
                // TODO: @see https://github.com/bvaughn/react-virtualized/issues/1357
                const item = items[index]
                return item && itemSelected(item) ? 'selected' : ''
              }}
              rowCount={items.length}
              rowGetter={({ index }) => items[index]}
              rowHeight={rowHeight}
              width={width}
            >
              {columns.map(({ key, label }, index) => (
                <Column
                  cellRenderer={cellRenderer}
                  dataKey={key}
                  headerRenderer={headerRenderer}
                  key={key}
                  label={label}
                  width={widths[index] ?? 0}
                />
              ))}
            </Table>
          )
        }}
      </AutoSizer>
      {loading && <LinearProgress />}
    </Box>
  )
}

export default ExplorerTable
