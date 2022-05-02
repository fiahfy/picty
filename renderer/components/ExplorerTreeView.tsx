import { SyntheticEvent, useEffect, useMemo, useState } from 'react'
import {
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material'
import { TreeView } from '@mui/lab'
import ExplorerTreeItem from 'components/ExplorerTreeItem'
import { ContentNode } from 'interfaces'
import { useStore } from 'utils/StoreContext'

const ExplorerTreeView = () => {
  const { history } = useStore()

  const [expanded, setExpanded] = useState<string[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [contentNodes, setContentNodes] = useState<ContentNode[]>([])

  useEffect(() => {
    ;(async () => {
      const node = await window.electronAPI.getContentNode(history.directory)
      const reducer = (carry: string[], node: ContentNode): string[] => {
        if (!node.children) {
          return carry
        }
        return [node.path, ...node.children.reduce(reducer, carry)]
      }
      const expanded = [node].reduce(reducer, [])
      setExpanded(expanded)
      setSelected([history.directory])
      setContentNodes([node])
    })()
  }, [history.directory])

  const contentNodeMap = useMemo(() => {
    const reducer = (
      carry: { [path: string]: ContentNode },
      node: ContentNode
    ): { [path: string]: ContentNode } => {
      return {
        [node.path]: node,
        ...(node.children ?? []).reduce(reducer, carry),
      }
    }
    return contentNodes.reduce(reducer, {})
  }, [contentNodes])

  const handleSelect = (_event: SyntheticEvent, nodeIds: string[] | string) => {
    if (Array.isArray(nodeIds)) {
      return
    }
    const content = contentNodeMap[nodeIds]
    content?.type === 'directory' && history.push(nodeIds)
  }

  const handleToggle = async (_event: SyntheticEvent, nodeIds: string[]) => {
    const expandedNodeId = nodeIds.filter(
      (nodeId) => !expanded.includes(nodeId)
    )[0]
    setExpanded(nodeIds)
    if (!expandedNodeId) {
      return
    }
    const content = contentNodeMap[expandedNodeId]
    if (content?.type !== 'directory' || content.children) {
      return
    }
    const children = await window.electronAPI.listContents(content.path)
    const mapper = (node: ContentNode): ContentNode => {
      if (node.path === content.path) {
        return {
          ...node,
          children,
        }
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(mapper),
        }
      }
      return node
    }
    setContentNodes((prevNodes) => prevNodes.map(mapper))
  }

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      expanded={expanded}
      onNodeSelect={handleSelect}
      onNodeToggle={handleToggle}
      selected={selected}
    >
      {contentNodes.map((node) => (
        <ExplorerTreeItem content={node} key={node.path} />
      ))}
    </TreeView>
  )
}

export default ExplorerTreeView
