import { ReactNode } from 'react'
import { Box, Typography, colors } from '@mui/material'
import {
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon,
  Folder as FolderIcon,
  Star as StarIcon,
} from '@mui/icons-material'
import { TreeItem, TreeView, treeItemClasses } from '@mui/lab'

type Props = {
  children?: ReactNode
  label: string
  nodeId: string
}

const StyledTreeItem = (props: Props) => {
  const { children, label, nodeId } = props

  return (
    <TreeItem
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
            sx={{ fontWeight: 'inherit', flexGrow: 1 }}
            variant="caption"
          >
            {label}
          </Typography>
        </Box>
      }
      nodeId={nodeId}
    >
      {children}
    </TreeItem>
  )
}

const ExplorerTreeView = () => {
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
        <StyledTreeItem label="Calendar" nodeId="2" />
        <StyledTreeItem label="Documents" nodeId="5" />
      </StyledTreeItem>
    </TreeView>
  )
}

export default ExplorerTreeView
