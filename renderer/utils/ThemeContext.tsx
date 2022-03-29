import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import {
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
  createTheme,
  PaletteMode,
} from '@mui/material'
import { usePersistedState } from './PersistedStateContext'
import { useTitleBar } from './TitleBarContext'

const ThemeContext = createContext<{
  forceMode: (mode: PaletteMode) => void
  resetMode: () => void
}>({
  forceMode: () => undefined,
  resetMode: () => undefined,
})

type Props = { children: ReactNode }

export const ThemeProvider = (props: Props) => {
  const { children } = props

  const { settings } = usePersistedState()
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

export const useTheme = () => useContext(ThemeContext)
