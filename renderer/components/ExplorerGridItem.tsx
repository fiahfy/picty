import { MouseEvent, useEffect, useMemo, useReducer } from 'react'
import fileUrl from 'file-url'
import { Box, ImageListItem, ImageListItemBar, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import FileIcon from 'components/FileIcon'
import NoOutlineRating from 'components/NoOutlineRating'
import { ExplorerContent, File } from 'interfaces'
import { useAppDispatch, useAppSelector } from 'store'
import { selectIsFavorite } from 'store/favorite'
import { rate } from 'store/rating'
import { contextMenuProps } from 'utils/contextMenu'
import { isImageFile } from 'utils/image'

type State = { paths: string[]; loading: boolean }

type Action =
  | {
      type: 'loaded'
      payload: string[]
    }
  | { type: 'loading' }

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'loaded':
      return {
        ...state,
        paths: action.payload,
        loading: false,
      }
    case 'loading':
      return { ...state, paths: [], loading: true }
  }
}

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
  const appDispatch = useAppDispatch()

  const [{ paths, loading }, dispatch] = useReducer(reducer, {
    paths: [],
    loading: false,
  })

  useEffect(() => {
    let unmounted = false

    ;(async () => {
      dispatch({ type: 'loading' })

      if (content.type === 'file') {
        return dispatch({ type: 'loaded', payload: [content.path] })
      }

      let files: File[] = []
      try {
        files = await window.electronAPI.listFiles(content.path)
      } catch (e) {
        // noop
      }
      if (unmounted) {
        return
      }
      const paths = files.map((file) => file.path)
      return dispatch({ type: 'loaded', payload: paths })
    })()

    return () => {
      unmounted = true
    }
  }, [content.path, content.type])

  const imagePath = useMemo(
    () => paths.filter((path) => isImageFile(path))[0],
    [paths]
  )

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
        '&:hover': {
          '.overlay': {
            backgroundColor: (theme) => theme.palette.action.hover,
          },
        },
        '&.selected': {
          '.overlay': {
            backgroundColor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.selectedOpacity
              ),
          },
          '&:hover': {
            '.overlay': {
              backgroundColor: (theme) =>
                alpha(
                  theme.palette.primary.main,
                  theme.palette.action.selectedOpacity +
                    theme.palette.action.hoverOpacity
                ),
            },
          },
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
                appDispatch(rate({ path: content.path, rating: value ?? 0 }))
              }
              precision={0.5}
              size="small"
              sx={{ my: 0.25 }}
              value={content.rating}
            />
            {!loading && content.type === 'directory' && (
              <Typography ml={1} noWrap variant="caption">
                {paths.length} items
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
      <Box
        className="overlay"
        sx={{
          height: '100%',
          pointerEvents: 'none',
          position: 'absolute',
          top: 0,
          width: '100%',
        }}
      />
    </ImageListItem>
  )
}

export default ExplorerGridItem
