
// process.dlopen = () => {
//   throw new Error('Load native module is not safe')
// }
import * as File from '~/utils/file'

const wait = (millis = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, millis)
  })
}

onmessage = async ({ data: { id, data } }) => {
  try {
    switch (id) {
      case 'listFiles': {
        await wait()
        const files = File.listFiles(...data)
        postMessage({ data: files })
        break
      }
      case 'getFiles': {
        await wait()
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
  close()
}
