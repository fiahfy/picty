import fs from 'fs'
import path from 'path'

export const get = (filepath) => {
  let obj = {
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

export const listFiles = (dirpath, options = { recursive: false }) => {
  const filepathes = fs.readdirSync(dirpath)
  return filepathes.reduce((carry, filename) => {
    try {
      if (filename.match(/^\./)) {
        return carry
      }
      const filepath = path.join(dirpath, filename)
      const file = get(filepath)
      if (!options.recursive || !file.directory) {
        return [...carry, file]
      }
      const files = listFiles(filepath, options)
      return [...carry, file, ...files]
    } catch (e) {
      console.error(e)
      return carry
    }
  }, [])
}

export const getFiles = (filepathes) => {
  return filepathes.map((filepath) => get(filepath))
}
