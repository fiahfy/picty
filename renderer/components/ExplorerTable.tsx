import {
  FocusEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
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
  colors,
} from '@mui/material'
import {
  Folder as FolderIcon,
  InsertDriveFile as InsertDriveFileIcon,
  Photo as PhotoIcon,
} from '@mui/icons-material'
import Rating from 'components/Rating'
import { Content } from 'interfaces'
import { useStore } from 'utils/StoreContext'
import { isImageFile } from 'utils/image'

const columns = [
  {
    dataKey: 'name',
    label: 'Name',
  },
  {
    dataKey: 'rating',
    label: 'Rating',
    width: 128,
    reverse: true,
  },
  {
    dataKey: 'dateModified',
    label: 'Date Modified',
    width: 160,
    reverse: true,
  },
]

const headerHeight = 32

const rowHeight = 32

type Order = 'asc' | 'desc'

type Row = Content & { rating: number }

type Props = {
  contentSelected: (content: Content) => boolean
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
  sortOption: { order: Order; orderBy: 'name' | 'rating' | 'dateModified' }
}

const ExplorerTable = (props: Props) => {
  const {
    contentSelected,
    contents,
    loading,
    onChangeSortOption,
    onClickContent,
    onDoubleClickContent,
    onFocusContent,
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

  const rows = useMemo(
    () =>
      contents
        .map((content) => ({
          ...content,
          rating: rating.getRating(content.path),
        }))
        .sort((a, b) => comparator(a, b)),
    [comparator, contents, rating]
  )

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
    onFocusContent(rows[index])
  }

  const handleRowClick = (info: RowMouseEventHandlerParams) =>
    onClickContent(info.rowData)

  const handleRowDoubleClick = (info: RowMouseEventHandlerParams) =>
    onDoubleClickContent(info.rowData)

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
            const isAsc =
              sortOption.orderBy === dataKey && sortOption.order === 'asc'
            onChangeSortOption({
              order: isAsc ? 'desc' : 'asc',
              orderBy: dataKey as 'name' | 'rating' | 'dateModified',
            })
          }}
          sx={{
            width: '100%',
            '.MuiTableSortLabel-icon': { fontSize: '16px' },
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
                  {rowData.type === 'directory' && (
                    <FolderIcon
                      fontSize="small"
                      sx={{ color: colors.blue['200'] }}
                    />
                  )}
                  {rowData.type === 'file' &&
                    (isImageFile(rowData.path) ? (
                      <PhotoIcon
                        fontSize="small"
                        sx={{ color: colors.green['200'] }}
                      />
                    ) : (
                      <InsertDriveFileIcon
                        fontSize="small"
                        sx={{ color: colors.grey['400'] }}
                      />
                    ))}
                  <Typography noWrap sx={{ ml: 1 }} variant="caption">
                    {rowData.name}
                  </Typography>
                </Box>
              ),
              rating: (
                <Box sx={{ display: 'flex' }}>
                  <Rating
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
                const row = rows[index]
                return row && contentSelected(row) ? 'selected' : ''
              }}
              rowCount={rows.length}
              rowGetter={({ index }) => rows[index]}
              rowHeight={rowHeight}
              width={width}
            >
              {columns.map(({ dataKey, label }, index) => (
                <Column
                  cellRenderer={cellRenderer}
                  dataKey={dataKey}
                  headerRenderer={headerRenderer}
                  key={dataKey}
                  label={label}
                  width={widths[index] ?? 0}
                />
              ))}
            </Table>
          )
        }}
      </AutoSizer>
      {loading && (
        <Box sx={{ marginTop: `${headerHeight}px`, width: '100%' }}>
          <LinearProgress />
        </Box>
      )}
    </Box>
  )
}

export default ExplorerTable
