import { AppProps } from 'next/app'
import Head from 'next/head'
import { CacheProvider, EmotionCache } from '@emotion/react'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { StoreProvider } from 'utils/StoreContext'
import { ThemeProvider } from 'utils/ThemeContext'
import { TitleBarProvider } from 'utils/TitleBarContext'
import createEmotionCache from 'utils/createEmotionCache'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta content="initial-scale=1, width=device-width" name="viewport" />
      </Head>
      <StoreProvider>
        <TitleBarProvider>
          <ThemeProvider>
            <Component {...pageProps} />
          </ThemeProvider>
        </TitleBarProvider>
      </StoreProvider>
    </CacheProvider>
  )
}
