import { useMemo } from 'react'
import { colors } from '@mui/material'
import {
  Folder as FolderIcon,
  InsertDriveFile as InsertDriveFileIcon,
  Photo as PhotoIcon,
} from '@mui/icons-material'
import { Item } from 'interfaces'
import { isImageFile } from 'utils/image'

type Props = {
  item: Item
  size?: 'small' | 'medium'
}

const ExplorerItemIcon = (props: Props) => {
  const { item, size } = props

  const type = useMemo(() => {
    if (item.type === 'directory') {
      return 'directory'
    }
    return isImageFile(item.path) ? 'image' : 'file'
  }, [item.path, item.type])

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

export default ExplorerItemIcon
