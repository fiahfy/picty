import { useMemo } from 'react'
import { blue, green, grey } from '@mui/material/colors'
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

const Icon = (props: Props) => {
  const { size, type } = props

  const MaterialIcon = useMemo(() => {
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
        return blue['200']
      case 'image':
        return green['200']
      case 'file':
        return grey['400']
    }
  }, [type])

  return <MaterialIcon fontSize={size} sx={{ color }} />
}

export default Icon
