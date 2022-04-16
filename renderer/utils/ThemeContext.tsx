import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import {
  CssBaseline,
  PaletteMode,
  Theme,
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from '@mui/material'
import { useStore } from 'utils/StoreContext'
import { useTitleBar } from 'utils/TitleBarContext'

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

  const { settings } = useStore()
  const { shown } = useTitleBar()

  const [mode, setMode] = useState<PaletteMode>()

  const forceMode = useCallback((mode: PaletteMode) => setMode(mode), [])
  const resetMode = useCallback(() => setMode(undefined), [])

  const currentMode = useMemo(() => {
    if (mode) {
      return mode
    }
    return settings.darkMode ? 'dark' : 'light'
  }, [mode, settings.darkMode])

  const theme = useMemo(
    () =>
      createTheme({
        components: {
          MuiAppBar: {
            styleOverrides: {
              root: {
                top: shown ? 22 : 0,
              },
            },
          },
        },
        mixins: {
          titleBar: {
            height: shown ? 22 : 0,
          },
        },
        palette: {
          mode: currentMode,
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
    [currentMode, shown]
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
