import fs from 'fs'
import path from 'path'

export const getFile = (filepath) => {
  const obj = {
    path: filepath,
    name: path.basename(filepath),
    dirname: path.dirname(filepath),
    exists: false,
    directory: false,
    modified_at: null
  }
  try {
    const stat = fs.lstatSync(filepath)
    return {
      ...obj,
      exists: true,
      directory: stat.isDirectory(),
      modified_at: stat.mtime
    }
  } catch (e) {
    if (e.code === 'ENOENT') {
      return obj
    }
    throw e
  }
}

export const getFirstChildPath = (dirpath) => {
  const filenames = fs.readdirSync(dirpath)
  const filename = filenames.find((filename) => !filename.match(/^\./))
  if (!filename) {
    return null
  }
  return path.join(dirpath, filename)
}

export const listFiles = (dirpath, options = { recursive: false }) => {
  const filenames = fs.readdirSync(dirpath)
  return filenames.reduce((carry, filename) => {
    try {
      if (filename.match(/^\./)) {
        return carry
      }
      const filepath = path.join(dirpath, filename)
      const file = getFile(filepath)
      if (!options.recursive || !file.directory) {
        return [...carry, file]
      }
      const files = listFiles(filepath, options)
      return [...carry, file, ...files]
    } catch (e) {
      return carry
    }
  }, [])
}

export const getFiles = (filepathes) => {
  return filepathes.map((filepath) => getFile(filepath))
}
