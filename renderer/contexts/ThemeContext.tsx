import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { CssBaseline, PaletteMode, Theme } from '@mui/material'
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from '@mui/material/styles'
import { useTitleBar } from 'contexts/TitleBarContext'
import { useAppSelector } from 'store'
import { selectDarkMode } from 'store/settings'

const ThemeContext = createContext<
  | {
      forceMode: (mode: PaletteMode) => void
      resetMode: () => void
      theme: Theme
    }
  | undefined
>(undefined)

type Props = { children: ReactNode }

export const ThemeProvider = (props: Props) => {
  const { children } = props

  const darkMode = useAppSelector(selectDarkMode)

  const { shown } = useTitleBar()

  const [forcedMode, setForcedMode] = useState<PaletteMode>()

  const forceMode = useCallback((mode: PaletteMode) => setForcedMode(mode), [])
  const resetMode = useCallback(() => setForcedMode(undefined), [])

  const mode = useMemo(() => {
    if (forcedMode) {
      return forcedMode
    }
    return darkMode ? 'dark' : 'light'
  }, [darkMode, forcedMode])

  useEffect(() => {
    if (mode === 'dark') {
      document.body.classList.remove('theme-light')
      document.body.classList.add('theme-dark')
    } else {
      document.body.classList.remove('theme-dark')
      document.body.classList.add('theme-light')
    }
  }, [mode])

  const theme = useMemo(
    () =>
      createTheme({
        components: {
          MuiAppBar: {
            styleOverrides: {
              root: {
                top: shown ? 28 : 0,
              },
            },
          },
        },
        mixins: {
          titleBar: {
            height: shown ? 28 : 0,
          },
        },
        palette: {
          mode,
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
    [mode, shown]
  )

  const value = { forceMode, resetMode, theme }

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

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a Provider')
  }
  return context
}
