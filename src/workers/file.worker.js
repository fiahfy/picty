import * as File from '~/utils/file'

onmessage = async ({ data: { id, data } }) => {
  try {
    switch (id) {
      case 'listFiles': {
        const files = File.listFiles(...data)
        postMessage({ data: files })
        break
      }
      case 'getFiles': {
        const files = File.getFiles(...data)
        postMessage({ data: files })
        break
      }
      default:
        postMessage({ data: [] })
        break
    }
  } catch (e) {
    console.error(e)
    postMessage({ data: [] })
  }
}
