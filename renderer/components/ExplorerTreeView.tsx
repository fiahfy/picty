import { ReactNode, useEffect, useState } from 'react'
import { Box, Typography, colors } from '@mui/material'
import {
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon,
  Folder as FolderIcon,
  Star as StarIcon,
} from '@mui/icons-material'
import { TreeItem, TreeView, treeItemClasses } from '@mui/lab'
import { useStore } from 'utils/StoreContext'

type Props = {
  children?: ReactNode
  'data-params'?: string
  label: string
  nodeId: string
  onClick?: () => void
  title?: string
}

const StyledTreeItem = (props: Props) => {
  const {
    children,
    'data-params': dataParams,
    label,
    nodeId,
    onClick,
    title,
  } = props

  return (
    <TreeItem
      data-params={dataParams}
      label={
        <Box sx={{ alignItems: 'center', display: 'flex', py: 0.75 }}>
          <Box sx={{ alignItems: 'center', display: 'flex', mr: 1 }}>
            {nodeId === 'root' ? (
              <StarIcon fontSize="small" sx={{ color: '#faaf00' }} />
            ) : (
              <FolderIcon fontSize="small" sx={{ color: colors.blue['200'] }} />
            )}
          </Box>
          <Typography
            noWrap
            sx={{ fontWeight: 'inherit', flexGrow: 1 }}
            title={title}
            variant="caption"
          >
            {label}
          </Typography>
        </Box>
      }
      nodeId={nodeId}
      onClick={onClick}
      sx={{ userSelect: 'none' }}
    >
      {children}
    </TreeItem>
  )
}

const ExplorerTreeView = () => {
  const { favorite, history } = useStore()

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

  const handleClick = (path: string) => history.push(path)

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      defaultExpanded={['root']}
      disableSelection
      sx={{
        height: '100%',
        overflowY: 'auto',
        [`& .${treeItemClasses.group}`]: {
          marginLeft: 0,
          [`& .${treeItemClasses.content}`]: {
            paddingLeft: 3,
          },
        },
      }}
    >
      <StyledTreeItem label="Favorites" nodeId="root">
        {favorites.map((favorite) => (
          <StyledTreeItem
            data-params={JSON.stringify({
              id: 'favorite',
              path: favorite.path,
            })}
            key={favorite.path}
            label={favorite.name}
            nodeId={favorite.path}
            onClick={() => handleClick(favorite.path)}
            title={favorite.path}
          />
        ))}
      </StyledTreeItem>
    </TreeView>
  )
}

export default ExplorerTreeView
