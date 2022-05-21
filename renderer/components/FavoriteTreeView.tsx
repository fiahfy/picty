import { SyntheticEvent, useEffect, useState } from 'react'
import { TreeView } from '@mui/lab'
import {
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material'
import FavoriteTreeItem from 'components/FavoriteTreeItem'
import { useAppDispatch, useAppSelector } from 'store'
import { remove, selectFavorites } from 'store/favorite'
import { push } from 'store/history'

const FavoriteTreeView = () => {
  const favorites = useAppSelector(selectFavorites)
  const dispatch = useAppDispatch()

  const [selected, setSelected] = useState<string[]>([])
  const [items, setItems] = useState<{ name: string; path: string }[]>([])

  useEffect(() => {
    const unsubscribe = window.electronAPI.subscribeRemoveFavorite((path) =>
      dispatch(remove(path))
    )
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    ;(async () => {
      const names = await Promise.all(
        favorites.map((path) => window.electronAPI.getBasename(path))
      )
      const items = favorites
        .map((path, i) => ({
          name: names[i] ?? '',
          path,
        }))
        .sort((a, b) => (a.name > b.name ? 1 : -1))
      setItems(items)
    })()
  }, [])

  const handleSelect = (_event: SyntheticEvent, nodeIds: string[] | string) => {
    setSelected([])
    if (Array.isArray(nodeIds)) {
      return
    }
    if (nodeIds === 'root') {
      return
    }
    dispatch(push(nodeIds))
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
            data-params={JSON.stringify({
              id: 'favorite',
              path: item.path,
            })}
            key={item.path}
            label={item.name}
            nodeId={item.path}
            title={item.path}
          />
        ))}
      </FavoriteTreeItem>
    </TreeView>
  )
}

export default FavoriteTreeView
