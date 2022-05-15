import { useMemo } from 'react'
import Icon from 'components/Icon'
import { File } from 'interfaces'
import { isImageFile } from 'utils/image'

type Props = {
  file: File
  size?: 'small' | 'medium'
}

const FileIcon = (props: Props) => {
  const { file, size } = props

  const type = useMemo(() => {
    if (file.type === 'directory') {
      return 'directory'
    }
    return isImageFile(file.path) ? 'image' : 'file'
  }, [file.path, file.type])

  return <Icon size={size} type={type} />
}

export default FileIcon
