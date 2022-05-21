import { MouseEvent, ReactNode } from 'react'
import { Box, Toolbar } from '@mui/material'
import ExplorerBar from 'components/ExplorerBar'
import SideBar from 'components/SideBar'
import TitleBar from 'components/TitleBar'
import { useAppSelector } from 'store'
import { selectDarkMode } from 'store/settings'

type Props = {
  children: ReactNode
  hideBars?: boolean
}

const Layout = (props: Props) => {
  const { children, hideBars = false } = props

  const darkMode = useAppSelector(selectDarkMode)

  const getTargetParams = (e: HTMLElement): string | undefined => {
    const params = e.dataset.params
    if (params) {
      return JSON.parse(params)
    }
    const parent = e.parentElement
    return parent ? getTargetParams(parent) : undefined
  }

  const handleMouseDown = async (e: MouseEvent<HTMLDivElement>) => {
    const params = getTargetParams(e.target as HTMLElement)
    await window.electronAPI.sendParamsForContextMenu(params)
  }

  return (
    <Box
      className={darkMode ? 'theme-dark' : 'theme-light'}
      onMouseDown={handleMouseDown}
      sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}
    >
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
      {!hideBars && <ExplorerBar />}
      {!hideBars && <SideBar />}
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
        {!hideBars && (
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
