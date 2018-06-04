import fs from 'fs'
import path from 'path'

export const get = (filepath) => {
  let obj = {
    name: path.basename(filepath),
    path: filepath,
    dirname: path.dirname(filepath),
    size: null,
    mtime: null,
    exists: false,
    directory: false
  }
  try {
    const stat = fs.lstatSync(filepath)
    return {
      ...obj,
      exists: true,
      directory: stat.isDirectory(),
      mtime: stat.mtime,
      size: stat.isDirectory() ? 0 : stat.size
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
      const files = file.listFiles(filepath, options)
      return [...carry, file, ...files]
    } catch (e) {
      return carry
    }
  }, [])
}
