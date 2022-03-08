import * as React from 'react'
import type { NextPage } from 'next'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Link from '../../src/Link'
import ProTip from '../../src/ProTip'
import Copyright from '../../src/Copyright'

const Home: NextPage = () => {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" gutterBottom variant="h4">
          MUI v5 + Next.js with TypeScript example
        </Typography>
        <Link color="secondary" href="/mui/about">
          Go to the about page
        </Link>
        <Link color="secondary" href="/">
          Go to Top
        </Link>
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  )
}

export default Home
