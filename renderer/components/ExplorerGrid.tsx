import {
  FocusEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { AutoSizer, Grid, GridCellProps } from 'react-virtualized'
import { Box, LinearProgress } from '@mui/material'
import ExplorerGridItem from 'components/ExplorerGridItem'
import { Item } from 'interfaces'

const rowHeight = 256

type Props = {
  itemSelected: (item: Item) => boolean
  items: Item[]
  loading: boolean
  onClickItem: (item: Item) => void
  onDoubleClickItem: (item: Item) => void
  onFocusItem: (item: Item) => void
  onKeyDownEnter: (e: KeyboardEvent<HTMLDivElement>) => void
}

const ExplorerGrid = (props: Props) => {
  const {
    itemSelected,
    items,
    loading,
    onClickItem,
    onDoubleClickItem,
    onFocusItem,
    onKeyDownEnter,
  } = props

  const ref = useRef<HTMLDivElement>()
  const [wrapperWidth, setWrapperWidth] = useState(0)

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

  const chunks = useMemo(
    () =>
      items.reduce(
        (carry, _, i) =>
          i % size ? carry : [...carry, items.slice(i, i + size)],
        [] as Item[][]
      ),
    [items, size]
  )

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
    onFocusItem(chunks[rowIndex][columnIndex])
  }

  const handleItemClick = (item: Item) => onClickItem(item)

  const handleItemDoubleClick = (item: Item) => onDoubleClickItem(item)

  const cellRenderer = ({
    columnIndex,
    key,
    rowIndex,
    style,
  }: GridCellProps) => {
    const item = chunks[rowIndex][columnIndex]
    return (
      item && (
        <Box key={key} style={style} sx={{ p: 0.25 }}>
          <ExplorerGridItem
            columnIndex={columnIndex}
            item={item}
            onClick={() => handleItemClick(item)}
            onDoubleClick={() => handleItemDoubleClick(item)}
            rowIndex={rowIndex}
            selected={itemSelected(item)}
          />
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
            columnWidth={wrapperWidth / size}
            height={height}
            rowCount={chunks.length}
            rowHeight={rowHeight}
            width={width}
          />
        )}
      </AutoSizer>
      {loading && <LinearProgress />}
    </Box>
  )
}

export default ExplorerGrid
