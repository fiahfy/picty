import React, { ReactNode } from 'react'
import Link from 'next/link'
import Head from 'next/head'

type Props = {
  children: ReactNode
  title?: string
}

const Layout = ({ children, title = 'This is the default title' }: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta content="initial-scale=1.0, width=device-width" name="viewport" />
    </Head>
    <header>
      <nav>
        <Link href="/">
          <a>Home</a>
        </Link>{' '}
        |{' '}
        <Link href="/about">
          <a>About</a>
        </Link>{' '}
        |{' '}
        <Link href="/initial-props">
          <a>With Initial Props</a>
        </Link>
        |{' '}
        <Link href="/mui">
          <a>MUI Sample</a>
        </Link>
      </nav>
    </header>
    {children}
    <footer>
      <hr />
      <span>{"I'm here to stay (Footer)"}</span>
    </footer>
  </div>
)

export default Layout
