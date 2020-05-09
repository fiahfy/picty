import fs from 'fs'
import path from 'path'

const getFile = (filepath) => {
  const obj = {
    path: filepath,
    name: path.basename(filepath),
    dirpath: path.dirname(filepath),
    dirname: path.basename(path.dirname(filepath)),
    exists: false,
    directory: false,
    modified_at: null,
  }
  try {
    const stat = fs.lstatSync(filepath)
    return {
      ...obj,
      exists: true,
      directory: stat.isDirectory(),
      modified_at: stat.mtime,
    }
  } catch (e) {
    if (e.code === 'ENOENT') {
      return obj
    }
    throw e
  }
}

const listFiles = (dirpath, options = { recursive: false }) => {
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

const getChildPathes = (dirpath) => {
  const filenames = fs.readdirSync(dirpath)
  return filenames.reduce((carry, filename) => {
    if (filename.match(/^\./)) {
      return carry
    }
    const filepath = path.join(dirpath, filename)
    return [...carry, filepath]
  }, [])
}

export default {
  getFile,
  listFiles,
  getChildPathes,
}
