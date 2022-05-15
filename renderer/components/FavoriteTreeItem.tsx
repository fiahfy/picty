import { ReactNode } from 'react'
import FileTreeItem from 'components/FileTreeItem'
import Icon from 'components/Icon'

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
          <Icon size="small" type="favorite" />
        ) : (
          <Icon size="small" type="directory" />
        )
      }
    >
      {children}
    </FileTreeItem>
  )
}

export default FavoriteTreeItem
