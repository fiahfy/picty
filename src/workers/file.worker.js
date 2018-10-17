import * as File from '~/utils/file'

onmessage = ({ data: { id, key, data } }) => {
  switch (id) {
    case 'listFiles': {
      const files = File.listFiles(...data)
      postMessage(files)
      break
    }
    case 'listFilesWithChild': {
      const [dirpath] = data
      const files = File.listFiles(dirpath).map((file) => {
        file.childPath = file.directory
          ? File.getFirstChildPath(file.path)
          : null
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
    case 'getFirstChildPath': {
      // console.log('worker', data)
      const filepath = File.getFirstChildPath(...data)
      // console.log('worker', data, filepath)
      postMessage({ key, id: data[0], data: filepath })
      break
    }
    default:
      postMessage([])
      break
  }
}
