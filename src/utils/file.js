import fs from 'fs'
import path from 'path'

export const getFile = (filepath) => {
  let obj = {
    path: filepath,
    name: path.basename(filepath),
    dirname: path.dirname(filepath),
    exists: false,
    directory: false,
    modified_at: null
  }
  try {
    console.time('lstatSync')
    const stat = fs.lstatSync(filepath)
    console.timeEnd('lstatSync')
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

export const findFile = (dirpath, callback) => {
  const filenames = fs.readdirSync(dirpath)
  const filename = filenames.find((filename) => {
    if (filename.match(/^\./)) {
      return false
    }
    const filepath = path.join(dirpath, filename)
    return callback(filepath)
  })
  if (!filename) {
    return null
  }
  return getFile(path.join(dirpath, filename))
}

export const listFiles = (dirpath, options = { recursive: false }) => {
  console.time('readdirSync')
  const filenames = fs.readdirSync(dirpath)
  console.timeEnd('readdirSync')
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
      console.error(e)
      return carry
    }
  }, [])
}

export const getFiles = (filepathes) => {
  return filepathes.map((filepath) => getFile(filepath))
}
