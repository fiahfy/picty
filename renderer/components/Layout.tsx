import { ReactNode } from 'react'
import { Box, Toolbar } from '@mui/material'
import TitleBar from 'components/TitleBar'
import SideBar from 'components/SideBar'

type Props = {
  children: ReactNode
  hiddenSideBar?: boolean
}

const Layout = (props: Props) => {
  const { children, hiddenSideBar = false } = props

  return (
    <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
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
      {!hiddenSideBar && <SideBar />}
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
        <Box sx={{ flexGrow: 1, position: 'relative', overflow: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export default Layout
