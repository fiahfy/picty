import { MouseEvent, ReactNode, useEffect } from 'react'
import { Box, Toolbar } from '@mui/material'
import ExplorerBar from 'components/ExplorerBar'
import Sidebar from 'components/Sidebar'
import TitleBar from 'components/TitleBar'
import { useAppDispatch } from 'store'
import { add, remove } from 'store/favorite'
import { getContextMenuParams } from 'utils/contextMenu'

type Props = {
  children: ReactNode
  dialog?: boolean
}

const Layout = (props: Props) => {
  const { children, dialog = false } = props

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (dialog) {
      return
    }

    const unsubscribeAddToFavorites =
      window.electronAPI.subscribeAddToFavorites((path) => dispatch(add(path)))
    const unsubscribeRemoveFromFavorites =
      window.electronAPI.subscribeRemoveFromFavorites((path) =>
        dispatch(remove(path))
      )
    return () => {
      unsubscribeAddToFavorites()
      unsubscribeRemoveFromFavorites()
    }
  }, [dialog, dispatch])

  const handleMouseDown = async (e: MouseEvent<HTMLDivElement>) => {
    const params = getContextMenuParams(e.target as HTMLElement)
    await window.electronAPI.sendParamsForContextMenu(params)
  }

  return (
    <Box
      onMouseDown={dialog ? undefined : handleMouseDown}
      sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}
    >
      {/* eslint-disable-next-line react/no-unknown-property */}
      <style global jsx>{`
        html,
        body,
        body > div:first-child,
        div#__next,
        div#__next > div {
          height: 100%;
        }
      `}</style>
      <TitleBar />
      {!dialog && <ExplorerBar />}
      {!dialog && <Sidebar />}
      <Box
        component="main"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        <Toolbar
          sx={{
            flexShrink: 0,
            minHeight: (theme) => `${theme.mixins.titleBar.height}px!important`,
          }}
        />
        {!dialog && (
          <Toolbar
            sx={{
              flexShrink: 0,
              minHeight: '65px!important',
            }}
          />
        )}
        <Box sx={{ flexGrow: 1, position: 'relative', overflow: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export default Layout
