import { SyntheticEvent, useEffect, useState } from 'react'
import { TreeView } from '@mui/lab'
import {
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material'
import FavoriteTreeItem from 'components/FavoriteTreeItem'
import { useStore } from 'utils/StoreContext'

const FavoriteTreeView = () => {
  const { favorite, history } = useStore()

  const [selected, setSelected] = useState<string[]>([])
  const [favorites, setFavorites] = useState<{ name: string; path: string }[]>(
    []
  )

  useEffect(() => {
    const unsubscribe = window.electronAPI.subscribeRemoveFavorite((path) =>
      favorite.remove(path)
    )
    return () => unsubscribe()
  }, [favorite])

  useEffect(() => {
    ;(async () => {
      const names = await Promise.all(
        favorite.list.map((path) => window.electronAPI.getBasename(path))
      )
      const favorites = favorite.list
        .map((path, i) => ({
          name: names[i],
          path,
        }))
        .sort((a, b) => (a.name > b.name ? 1 : -1))
      setFavorites(favorites)
    })()
  }, [favorite.list])

  const handleSelect = (_event: SyntheticEvent, nodeIds: string[] | string) => {
    setSelected([])
    if (Array.isArray(nodeIds)) {
      return
    }
    if (nodeIds === 'root') {
      return
    }
    history.push(nodeIds)
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
        {favorites.map((favorite) => (
          <FavoriteTreeItem
            data-params={JSON.stringify({
              id: 'favorite',
              path: favorite.path,
            })}
            key={favorite.path}
            label={favorite.name}
            nodeId={favorite.path}
            title={favorite.path}
          />
        ))}
      </FavoriteTreeItem>
    </TreeView>
  )
}

export default FavoriteTreeView
