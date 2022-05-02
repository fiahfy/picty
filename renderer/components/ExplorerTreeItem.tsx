import { CircularProgress } from '@mui/material'
import ContentIcon from 'components/ContentIcon'
import FileIcon from 'components/FileIcon'
import FileTreeItem from 'components/FileTreeItem'
import { ContentNode } from 'interfaces'

const max = 100

type Props = {
  content: ContentNode
}

const ExplorerTreeItem = (props: Props) => {
  const { content, ...others } = props

  const over = (content.children ?? []).length - max

  return (
    <FileTreeItem
      {...others}
      fileIcon={<ContentIcon content={content} size="small" />}
      label={content.name}
      nodeId={content.path}
      title={content.path}
    >
      {content.type === 'directory' &&
        (content.children ? (
          <>
            {content.children.slice(0, max).map((content) => (
              <ExplorerTreeItem content={content} key={content.path} />
            ))}
            {over > 0 && (
              <FileTreeItem
                fileIcon={<FileIcon size="small" type="file" />}
                label={`Other ${over} items`}
                nodeId={`${content.path}<others>`}
              />
            )}
          </>
        ) : (
          <FileTreeItem
            fileIcon={<CircularProgress size={20} />}
            label="Loading items..."
            nodeId={`${content.path}<loader>`}
          />
        ))}
    </FileTreeItem>
  )
}

export default ExplorerTreeItem
