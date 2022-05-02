import { ReactNode, SyntheticEvent, useEffect, useState } from 'react'
import { TreeView } from '@mui/lab'
import {
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material'
import FileIcon from 'components/FileIcon'
import { FileTreeItem } from 'components/FileTreeItem'
import { useStore } from 'utils/StoreContext'

type FavoriteTreeItemProps = {
  children?: ReactNode
  label: string
  nodeId: string
  title?: string
}

const FavoriteTreeItem = (props: FavoriteTreeItemProps) => {
  const { children, ...others } = props
  return (
    <FileTreeItem
      {...others}
      fileIcon={
        others.nodeId === 'root' ? (
          <FileIcon size="small" type="favorite" />
        ) : (
          <FileIcon size="small" type="directory" />
        )
      }
    >
      {children}
    </FileTreeItem>
  )
}

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
