import fs from 'fs'
import path from 'path'

export const getFile = (filepath) => {
  const stats = fs.lstatSync(filepath)
  return {
    name: path.basename(filepath),
    path: filepath,
    stats
  }
}

export const listFiles = (dirpath, options = { recursive: false }) => {
  const filepathes = fs.readdirSync(dirpath)
  return filepathes.reduce((carry, filename) => {
    try {
      if (filename.match(/^\./)) {
        return carry
      }
      const file = getFile(path.join(dirpath, filename))
      if (!options.recursive || !file.stats.isDirectory()) {
        return [...carry, file]
      }
      const files = listFiles(file.path, options)
      return [...carry, file, ...files]
    } catch (e) {
      return carry
    }
  }, [])
}

export const isImage = (file) => {
  const extensions = [
    '.jpeg',
    '.jpg',
    '.png',
    '.gif',
    '.webp',
    '.tif',
    '.bmp',
    '.jxr',
    '.psd'
  ]
  return extensions.includes(path.extname(file).toLowerCase())
}
