import { ReactNode } from 'react'
import { Box, Toolbar } from '@mui/material'
import TitleBar from 'components/TitleBar'
import SideBar from 'components/SideBar'

type Props = {
  children: ReactNode
}

const Layout = (props: Props) => {
  const { children } = props

  return (
    <Box sx={{ display: 'flex' }}>
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
      <SideBar />
      <Box
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
      >
        <Toolbar sx={{ flexShrink: 0 }} />
        <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export default Layout
