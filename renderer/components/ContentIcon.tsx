import { useMemo } from 'react'
import FileIcon from 'components/FileIcon'
import { Content } from 'interfaces'
import { isImageFile } from 'utils/image'

type Props = {
  content: Content
  size?: 'small' | 'medium'
}

const ContentIcon = (props: Props) => {
  const { content, size } = props

  const type = useMemo(() => {
    if (content.type === 'directory') {
      return 'directory'
    }
    return isImageFile(content.path) ? 'image' : 'file'
  }, [content.path, content.type])

  return <FileIcon size={size} type={type} />
}

export default ContentIcon
