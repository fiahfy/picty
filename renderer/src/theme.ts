import { colors, createTheme } from '@mui/material'

// Create a theme instance.
const theme = createTheme({
  mixins: {
    toolbar: {
      height: 22,
      padding: '0 72px!important',
    },
  },
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: colors.red.A400,
    },
  },
})

export default theme
