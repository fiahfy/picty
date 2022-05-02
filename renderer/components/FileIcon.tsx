import { useMemo } from 'react'
import { colors } from '@mui/material'
import {
  Folder as FolderIcon,
  InsertDriveFile as InsertDriveFileIcon,
  Photo as PhotoIcon,
  Star as StarIcon,
} from '@mui/icons-material'

type Props = {
  size?: 'small' | 'medium'
  type: 'favorite' | 'directory' | 'image' | 'file'
}

const FileIcon = (props: Props) => {
  const { size, type } = props

  const Icon = useMemo(() => {
    switch (type) {
      case 'favorite':
        return StarIcon
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
      case 'favorite':
        return '#faaf00'
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

export default FileIcon
