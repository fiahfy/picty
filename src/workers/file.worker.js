import * as File from '~/utils/file'

onmessage = ({ data: { id, data } }) => {
  try {
    switch (id) {
      case 'listFiles': {
        const files = File.listFiles(...data)
        postMessage(files)
        break
      }
      case 'listFilesWithChildren': {
        const files = File.listFiles(...data).map((file) => {
          file.children = file.directory ? File.listFiles(file.path) : []
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
      case 'listFileSets': {
        const [filepathes] = data
        const fileSets = filepathes.reduce((carry, filepath) => {
          return {
            ...carry,
            [filepath]: File.listFiles(filepath)
          }
        }, {})
        postMessage(fileSets)
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
