import { AppProps } from 'next/app'
import Head from 'next/head'
import { CacheProvider, EmotionCache } from '@emotion/react'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import Layout from 'components/Layout'
import { StoreProvider } from 'contexts/StoreContext'
import { ThemeProvider } from 'contexts/ThemeContext'
import { TitleBarProvider } from 'contexts/TitleBarContext'
import createEmotionCache from 'utils/createEmotionCache'
import 'styles.css'

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
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ThemeProvider>
        </TitleBarProvider>
      </StoreProvider>
    </CacheProvider>
  )
}
