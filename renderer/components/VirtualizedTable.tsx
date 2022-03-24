import { ComponentProps, useEffect, useMemo, useRef, useState } from 'react'
import {
  Box,
  TableCell,
  TableCellProps as MuiTableCellProps,
} from '@mui/material'
import {
  AutoSizer,
  Column,
  Table,
  TableCellProps,
  TableHeaderProps,
} from 'react-virtualized'

type ColumnData = {
  dataKey: string
  label: string
  align?: MuiTableCellProps['align']
  width?: number
}

type Props = Pick<
  ComponentProps<typeof Table>,
  'onRowClick' | 'onRowDoubleClick' | 'rowCount' | 'rowGetter'
> & {
  columns: ColumnData[]
  headerHeight?: number
  rowHeight?: number
}

const VirtualizedTable = (props: Props) => {
  const {
    columns,
    headerHeight = 48,
    onRowClick,
    rowHeight = 48,
    ...others
  } = props

  const ref = useRef()
  const [wrapperWidth, setWrapperWidth] = useState(0)

  useEffect(() => {
    const handleResize = (entries: ResizeObserverEntry[]) => {
      const entry = entries[0]
      if (entry) {
        setWrapperWidth(entry.contentRect.width)
      }
    }
    const observer = new ResizeObserver(handleResize)
    observer.observe(ref.current)
    return () => {
      observer.disconnect()
    }
  }, [])

  const widths = useMemo(() => {
    const widths = columns.map((column) => column.width)
    const flexibleNum = widths.filter((width) => width === undefined).length
    if (flexibleNum === 0) {
      return widths
    }
    const sumWidth = widths.reduce((carry, width) => carry + (width ?? 0), 0)
    const flexibleWidth = (wrapperWidth - sumWidth) / flexibleNum
    return widths.map((width) => (width === undefined ? flexibleWidth : width))
  }, [columns, wrapperWidth])

  const headerRenderer = ({
    label,
    columnIndex,
  }: TableHeaderProps & { columnIndex: number }) => {
    return (
      <TableCell
        align={columns[columnIndex].align}
        component="div"
        sx={{
          alignItems: 'center',
          display: 'flex',
          height: headerHeight,
          py: 0,
        }}
        variant="head"
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
            backgroundColor: onRowClick ? 'grey.200' : 'initial',
          },
        },
      }}
    >
      <AutoSizer>
        {({ height, width }) => (
          <Table
            {...others}
            headerHeight={headerHeight}
            height={height}
            onRowClick={onRowClick}
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
    </Box>
  )
}

export default VirtualizedTable
