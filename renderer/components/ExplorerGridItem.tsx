import { MouseEvent, useEffect, useMemo, useState } from 'react'
import fileUrl from 'file-url'
import { Box, ImageListItem, ImageListItemBar, Typography } from '@mui/material'
import FileIcon from 'components/FileIcon'
import NoOutlineRating from 'components/NoOutlineRating'
import { ExplorerContent, File } from 'interfaces'
import { useAppDispatch, useAppSelector } from 'store'
import { selectIsFavorite } from 'store/favorite'
import { rate } from 'store/rating'
import { contextMenuProps } from 'utils/contextMenu'
import { isImageFile } from 'utils/image'
import { semaphore } from 'utils/semaphore'

type Props = {
  columnIndex: number
  content: ExplorerContent
  onClick: (e: MouseEvent<HTMLDivElement>) => void
  onDoubleClick: (e: MouseEvent<HTMLDivElement>) => void
  rowIndex: number
  selected: boolean
}

const ExplorerGridItem = (props: Props) => {
  const { columnIndex, content, onClick, onDoubleClick, rowIndex, selected } =
    props

  const favorite = useAppSelector(selectIsFavorite)(content.path)
  const dispatch = useAppDispatch()

  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState(0)
  const [imagePath, setImagePath] = useState<string>()

  useEffect(() => {
    setLoading(true)
    setImages(0)
    setImagePath(undefined)

    if (content.type === 'file') {
      if (isImageFile(content.path)) {
        setImagePath(content.path)
      }
      setLoading(false)
      return
    }

    let unmounted = false
    semaphore.acquire(async () => {
      let files: File[] = []
      try {
        files = await window.electronAPI.listFiles(content.path)
      } catch (e) {
        // noop
      }
      if (unmounted) {
        return
      }
      const images = files.filter((file) => isImageFile(file.path))
      setImages(images.length)
      setImagePath(images[0]?.path)
      setLoading(false)
    })

    return () => {
      unmounted = true
    }
  }, [content.path, content.type])

  const message = useMemo(
    () => (loading ? 'Loading...' : 'No Images'),
    [loading]
  )

  const enabled = useMemo(
    () => content.type === 'directory' || isImageFile(content.path),
    [content.path, content.type]
  )

  return (
    <ImageListItem
      {...contextMenuProps([
        {
          id: 'start-presentation',
          enabled,
          value: content.path,
        },
        {
          id: 'add-favorite',
          enabled: !favorite,
          value: content.path,
        },
      ])}
      className={selected ? 'selected' : undefined}
      component="div"
      data-grid-column={columnIndex + 1}
      data-grid-row={rowIndex + 1}
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
            <FileIcon file={content} size="small" />
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
              onChange={(_e, value) =>
                dispatch(rate({ path: content.path, rating: value ?? 0 }))
              }
              precision={0.5}
              size="small"
              sx={{ my: 0.25 }}
              value={content.rating}
            />
            {!loading && content.type === 'directory' && (
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
              title={content.name}
              variant="caption"
            >
              {content.name}
            </Typography>
          </Box>
        }
      />
    </ImageListItem>
  )
}

export default ExplorerGridItem
