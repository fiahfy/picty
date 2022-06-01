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
      return 'folder'
    }
    return isImageFile(file.path) ? 'photo' : 'insert-drive-file'
  }, [file.path, file.type])

  return <Icon size={size} type={type} />
}

export default FileIcon
