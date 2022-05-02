import { ReactNode } from 'react'
import FileIcon from 'components/FileIcon'
import FileTreeItem from 'components/FileTreeItem'

type Props = {
  children?: ReactNode
  label: string
  nodeId: string
  title?: string
}

const FavoriteTreeItem = (props: Props) => {
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

export default FavoriteTreeItem
