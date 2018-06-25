import * as File from '~/utils/file'

onmessage = ({ data: { id, data } }) => {
  try {
    switch (id) {
      case 'listFiles': {
        const files = File.listFiles(...data)
        postMessage(files)
        break
      }
      case 'getFiles': {
        const files = File.getFiles(...data)
        postMessage(files)
        break
      }
      default:
        postMessage([])
        break
    }
  } catch (e) {
    console.error(e)
    postMessage([])
  }
}
