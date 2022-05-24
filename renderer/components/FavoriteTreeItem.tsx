import { ReactNode } from 'react'
import { BoxProps } from '@mui/material'
import FileTreeItem from 'components/FileTreeItem'
import Icon from 'components/Icon'
import { contextMenuProps } from 'utils/contextMenu'

type Props = {
  children?: ReactNode
  label: string
  nodeId: string
}

const FavoriteTreeItem = (props: Props) => {
  const { children, label, nodeId } = props

  const root = nodeId === 'root'

  return (
    <FileTreeItem
      LabelProps={
        root
          ? {}
          : (contextMenuProps([
              {
                id: 'start-presentation',
                enabled: true,
                value: nodeId,
              },
              {
                id: 'remove-favorite',
                enabled: true,
                value: nodeId,
              },
            ]) as BoxProps)
      }
      fileIcon={
        root ? (
          <Icon size="small" type="favorite" />
        ) : (
          <Icon size="small" type="directory" />
        )
      }
      label={label}
      nodeId={nodeId}
      title={root ? undefined : nodeId}
    >
      {children}
    </FileTreeItem>
  )
}

export default FavoriteTreeItem
