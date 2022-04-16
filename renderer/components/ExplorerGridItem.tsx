import { MouseEvent, useEffect, useMemo, useState } from 'react'
import fileUrl from 'file-url'
import { Box, ImageListItem, ImageListItemBar, Typography } from '@mui/material'
import ExplorerItemIcon from 'components/ExplorerItemIcon'
import NoOutlineRating from 'components/NoOutlineRating'
import { Item } from 'interfaces'
import { useStore } from 'utils/StoreContext'
import { isImageFile } from 'utils/image'
import { semaphore } from 'utils/semaphore'

type Props = {
  columnIndex: number
  item: Item
  onClick: (e: MouseEvent<HTMLDivElement>) => void
  onDoubleClick: (e: MouseEvent<HTMLDivElement>) => void
  rowIndex: number
  selected: boolean
}

const ExplorerGridItem = (props: Props) => {
  const { columnIndex, item, onClick, onDoubleClick, rowIndex, selected } =
    props

  const { rating } = useStore()

  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState(0)
  const [imagePath, setImagePath] = useState<string>()

  useEffect(() => {
    setLoading(true)
    setImages(0)
    setImagePath(undefined)

    if (item.type === 'file') {
      if (isImageFile(item.path)) {
        setImagePath(item.path)
      }
      setLoading(false)
      return
    }

    let unmounted = false
    semaphore.acquire(async () => {
      const contents = await window.electronAPI.listContents(item.path)
      if (unmounted) {
        return
      }
      const images = contents.filter((content) => isImageFile(content.path))
      setImages(images.length)
      setImagePath(images[0]?.path)
      setLoading(false)
    })

    return () => {
      unmounted = true
    }
  }, [item.path, item.type])

  const message = useMemo(
    () => (loading ? 'Loading...' : 'No Images'),
    [loading]
  )

  const enabled = useMemo(
    () => item.type === 'directory' || isImageFile(item.path),
    [item.path, item.type]
  )

  return (
    <ImageListItem
      className={selected ? 'selected' : undefined}
      component="div"
      data-grid-column={columnIndex + 1}
      data-grid-row={rowIndex + 1}
      data-params={JSON.stringify({
        id: 'presentation',
        enabled,
      })}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      sx={{
        cursor: 'pointer',
        height: '100%!important',
        width: '100%',
        '&.selected': {
          outlineColor: (theme) => theme.palette.primary.main,
          outlineStyle: 'solid',
          outlineWidth: '1px',
        },
        '&:focus': {
          outlineColor: (theme) => theme.palette.primary.main,
          outlineStyle: 'solid',
          outlineWidth: '2px',
        },
      }}
      tabIndex={0}
    >
      {imagePath ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={fileUrl(imagePath)}
          style={{ objectPosition: 'center top' }}
        />
      ) : (
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            height: '100%',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption">{message}</Typography>
        </Box>
      )}
      <ImageListItemBar
        actionIcon={
          <Box mt={-3} mx={1}>
            <ExplorerItemIcon item={item} size="small" />
          </Box>
        }
        actionPosition="left"
        subtitle={
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <NoOutlineRating
              color="primary"
              onChange={(_e, value) => rating.setRating(item.path, value ?? 0)}
              precision={0.5}
              size="small"
              sx={{ my: 0.25 }}
              value={item.rating}
            />
            {!loading && item.type === 'directory' && (
              <Typography ml={1} noWrap variant="caption">
                {images} images
              </Typography>
            )}
          </Box>
        }
        sx={{ '.MuiImageListItemBar-titleWrap': { p: 0, pb: 1, pr: 1 } }}
        title={
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              height: (theme) => theme.spacing(5),
            }}
          >
            <Typography
              sx={{
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                display: '-webkit-box',
                lineHeight: 1.4,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'initial',
                wordBreak: 'break-all',
              }}
              title={item.name}
              variant="caption"
            >
              {item.name}
            </Typography>
          </Box>
        }
      />
    </ImageListItem>
  )
}

export default ExplorerGridItem
