import { useMemo } from 'react'
import FileIcon from 'components/FileIcon'
import { ExplorerContent } from 'interfaces'
import { isImageFile } from 'utils/image'

type Props = {
  content: ExplorerContent
  size?: 'small' | 'medium'
}

const ExplorerContentIcon = (props: Props) => {
  const { content, size } = props

  const type = useMemo(() => {
    if (content.type === 'directory') {
      return 'directory'
    }
    return isImageFile(content.path) ? 'image' : 'file'
  }, [content.path, content.type])

  return <FileIcon size={size} type={type} />
}

export default ExplorerContentIcon
