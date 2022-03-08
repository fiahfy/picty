import Link from 'next/link'
import Layout from '../components/Layout'

const IndexPage = () => {
  const onSayHiClick = () => {
    window.electronAPI.sendMessage('hi from next').then((result) => {
      alert(result)
    })
  }

  return (
    <Layout title="Home | Next.js + TypeScript + Electron Example">
      <h1>Hello Next.js 👋</h1>
      <button onClick={onSayHiClick}>Say hi to electron</button>
      <p>
        <Link href="/about">
          <a>About</a>
        </Link>
      </p>
    </Layout>
  )
}

export default IndexPage
