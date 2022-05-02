import { ReactNode, SyntheticEvent, useEffect, useState } from 'react'
import {
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material'
import { TreeView } from '@mui/lab'
import FileIcon from 'components/FileIcon'
import { FileTreeItem } from 'components/FileTreeItem'
import { ContentNode } from 'interfaces'
import { useStore } from 'utils/StoreContext'

type ExplorerTreeItemProps = {
  children: ReactNode
  label: string
  nodeId: string
  onClick: () => void
  title: string
}

const ExplorerTreeItem = (props: ExplorerTreeItemProps) => {
  const { children, ...others } = props
  return (
    <FileTreeItem
      {...others}
      fileIcon={<FileIcon size="small" type="directory" />}
    >
      {children}
    </FileTreeItem>
  )
}

const ExplorerTreeView = () => {
  const { history } = useStore()

  const [expanded, setExpanded] = useState<string[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [contentNodes, setContentNodes] = useState<ContentNode[]>([])

  useEffect(() => {
    ;(async () => {
      const node = await window.electronAPI.getContentNode(history.directory)
      const reducer = (carry: string[], node: ContentNode): string[] => {
        return [node.path, ...(node.children ?? []).reduce(reducer, carry)]
      }
      const expanded = [node].reduce(reducer, [])
      setExpanded(expanded)
      setSelected([history.directory])
      setContentNodes([node])
    })()
  }, [history.directory])

  const handleSelect = (_event: SyntheticEvent, nodeIds: string[] | string) => {
    setSelected([])
    if (Array.isArray(nodeIds)) {
      return
    }
    history.push(nodeIds)
  }

  const handleToggle = (_event: SyntheticEvent, nodeIds: string[]) =>
    setExpanded(nodeIds)

  const handleClick = (path: string) => history.push(path)

  const renderNode = (node: ContentNode) => (
    <ExplorerTreeItem
      key={node.path}
      label={node.name}
      nodeId={node.path}
      onClick={() => handleClick(node.path)}
      title={node.path}
    >
      {node.children?.map((child) => renderNode(child))}
    </ExplorerTreeItem>
  )

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      expanded={expanded}
      onNodeSelect={handleSelect}
      onNodeToggle={handleToggle}
      selected={selected}
    >
      {contentNodes.map((node) => renderNode(node))}
    </TreeView>
  )
}

export default ExplorerTreeView
