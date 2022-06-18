import { SyntheticEvent, useEffect, useState } from 'react'
import { TreeView } from '@mui/lab'
import {
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material'
import FavoriteTreeItem from 'components/FavoriteTreeItem'
import { useAppDispatch, useAppSelector } from 'store'
import { selectFavorites } from 'store/favorite'
import { move } from 'store/history'

const FavoriteTreeView = () => {
  const favorites = useAppSelector(selectFavorites)
  const dispatch = useAppDispatch()

  const [selected, setSelected] = useState<string[]>([])
  const [items, setItems] = useState<{ name: string; path: string }[]>([])

  useEffect(() => {
    ;(async () => {
      const names = await Promise.all(
        favorites.map((path) => window.electronAPI.basename(path))
      )
      const items = favorites
        .map((path, i) => ({
          name: names[i] ?? '',
          path,
        }))
        .sort((a, b) => (a.name > b.name ? 1 : -1))
      setItems(items)
    })()
  }, [favorites])

  const handleSelect = (_event: SyntheticEvent, nodeIds: string[] | string) => {
    setSelected([])
    if (Array.isArray(nodeIds)) {
      return
    }
    if (nodeIds === 'root') {
      return
    }
    dispatch(move(nodeIds))
  }

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      defaultExpanded={['root']}
      onNodeSelect={handleSelect}
      selected={selected}
    >
      <FavoriteTreeItem label="Favorites" nodeId="root">
        {items.map((item) => (
          <FavoriteTreeItem
            key={item.path}
            label={item.name}
            nodeId={item.path}
          />
        ))}
      </FavoriteTreeItem>
    </TreeView>
  )
}

export default FavoriteTreeView
