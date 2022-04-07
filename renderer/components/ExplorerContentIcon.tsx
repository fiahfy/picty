import { useMemo } from 'react'
import { colors } from '@mui/material'
import {
  Folder as FolderIcon,
  InsertDriveFile as InsertDriveFileIcon,
  Photo as PhotoIcon,
} from '@mui/icons-material'
import { Content } from 'interfaces'
import { isImageFile } from 'utils/image'

type Props = {
  content: Content
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

  const Icon = useMemo(() => {
    switch (type) {
      case 'directory':
        return FolderIcon
      case 'image':
        return PhotoIcon
      case 'file':
        return InsertDriveFileIcon
    }
  }, [type])

  const color = useMemo(() => {
    switch (type) {
      case 'directory':
        return colors.blue['200']
      case 'image':
        return colors.green['200']
      case 'file':
        return colors.grey['400']
    }
  }, [type])

  return <Icon fontSize={size} sx={{ color }} />
}

export default ExplorerContentIcon
