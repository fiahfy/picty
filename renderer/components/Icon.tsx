import { useMemo } from 'react'
import { blue, green, grey } from '@mui/material/colors'
import {
  Folder as FolderIcon,
  InsertDriveFile as InsertDriveFileIcon,
  Photo as PhotoIcon,
  StarBorder as StarBorderIcon,
  Star as StarIcon,
} from '@mui/icons-material'

type Props = {
  size?: 'small' | 'medium'
  type: 'star' | 'star-border' | 'folder' | 'photo' | 'insert-drive-file'
}

const Icon = (props: Props) => {
  const { size, type } = props

  const MaterialIcon = useMemo(() => {
    switch (type) {
      case 'star':
        return StarIcon
      case 'star-border':
        return StarBorderIcon
      case 'folder':
        return FolderIcon
      case 'photo':
        return PhotoIcon
      case 'insert-drive-file':
        return InsertDriveFileIcon
    }
  }, [type])

  const color = useMemo(() => {
    switch (type) {
      case 'star':
        return '#faaf00'
      case 'star-border':
        return undefined
      case 'folder':
        return blue['200']
      case 'photo':
        return green['200']
      case 'insert-drive-file':
        return grey['400']
    }
  }, [type])

  return <MaterialIcon fontSize={size} sx={{ color }} />
}

export default Icon
