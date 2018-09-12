import * as File from '~/utils/file'

onmessage = ({ data: { id, data } }) => {
  try {
    switch (id) {
      case 'listFiles': {
        const files = File.listFiles(...data)
        postMessage(files)
        break
      }
      case 'listFilesWithChild': {
        const [dirpath] = data
        const files = File.listFiles(dirpath).map((file) => {
          file.childPath = file.directory ? File.getFirstChildPath(file.path) : null
          return file
        })
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
