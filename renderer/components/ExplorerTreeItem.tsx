import { CircularProgress } from '@mui/material'
import FileIcon from 'components/FileIcon'
import Icon from 'components/Icon'
import FileTreeItem from 'components/FileTreeItem'
import { FileNode } from 'interfaces'

const max = 100

type Props = {
  file: FileNode
}

const ExplorerTreeItem = (props: Props) => {
  const { file, ...others } = props

  const over = (file.children ?? []).length - max

  return (
    <FileTreeItem
      {...others}
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
