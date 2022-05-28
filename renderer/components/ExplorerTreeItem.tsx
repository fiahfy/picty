import { useMemo } from 'react'
import { BoxProps, CircularProgress } from '@mui/material'
import FileIcon from 'components/FileIcon'
import FileTreeItem from 'components/FileTreeItem'
import Icon from 'components/Icon'
import { FileNode } from 'interfaces'
import { useAppSelector } from 'store'
import { selectIsFavorite } from 'store/favorite'
import { contextMenuProps } from 'utils/contextMenu'
import { isImageFile } from 'utils/image'

const max = 100

type Props = {
  file: FileNode
}

const ExplorerTreeItem = (props: Props) => {
  const { file } = props

  const favorite = useAppSelector(selectIsFavorite)(file.path)

  const over = (file.children ?? []).length - max

  const enabled = useMemo(
    () => file.type === 'directory' || isImageFile(file.path),
    [file.path, file.type]
  )

  return (
    <FileTreeItem
      LabelProps={
        contextMenuProps([
          {
            id: 'start-presentation',
            enabled,
            value: file.path,
          },
          {
            id: 'add-favorite',
            enabled: !favorite,
            value: file.path,
          },
        ]) as BoxProps
      }
      fileIcon={<FileIcon file={file} size="small" />}
      label={file.name}
      nodeId={file.path}
      title={file.path}
    >
      {file.type === 'directory' &&
        (file.children ? (
          <>
            {file.children.slice(0, max).map((file) => (
              <ExplorerTreeItem file={file} key={file.path} />
            ))}
            {over > 0 && (
              <FileTreeItem
                fileIcon={<Icon size="small" type="file" />}
                label={`Other ${over} items`}
                nodeId={`${file.path}<others>`}
              />
            )}
          </>
        ) : (
          <FileTreeItem
            fileIcon={<CircularProgress size={20} />}
            label="Loading items..."
            nodeId={`${file.path}<loader>`}
          />
        ))}
    </FileTreeItem>
  )
}

export default ExplorerTreeItem
