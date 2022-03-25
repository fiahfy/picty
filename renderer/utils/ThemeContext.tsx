import { createContext, ReactNode, useContext, useMemo, useState } from 'react'
import {
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from '@mui/material'
import { usePersistedState } from './PersistedStateContext'

const ThemeContext = createContext<{
  setTitleBar: (titleBar: boolean) => void
}>({
  setTitleBar: () => undefined,
})

type Props = { children: ReactNode }

export const ThemeProvider = (props: Props) => {
  const { children } = props

  const { state } = usePersistedState()

  const [titleBar, setTitleBar] = useState(false)

  const theme = useMemo(
    () =>
      createTheme({
        components: {
          MuiAppBar: {
            styleOverrides: {
              root: {
                top: titleBar ? 22 : 0,
              },
            },
          },
        },
        mixins: {
          titleBar: {
            height: titleBar ? 22 : 0,
          },
        },
        palette: {
          mode: state.settings.darkMode ? 'dark' : 'light',
          primary: {
            main: '#ff4081',
          },
          // secondary: {
          //   main: '#19857b',
          // },
          // error: {
          //   main: colors.red.A400,
          // },
        },
      }),
    [state.settings.darkMode, titleBar]
  )

  const value = { setTitleBar, theme }

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
