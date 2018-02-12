import fs from 'fs'
import path from 'path'

export default class File {
  constructor (filepath) {
    this.name = path.basename(filepath)
    this.path = filepath
  }
  get size () {
    return fs.lstatSync(this.path).size
  }
  get mtime () {
    return fs.lstatSync(this.path).mtime
  }
  get parent () {
    return new File(path.dirname(this.path))
  }
  isDirectory () {
    return fs.lstatSync(this.path).isDirectory()
  }
  isImage () {
    return [
      '.jpeg',
      '.jpg',
      '.png',
      '.gif',
      '.webp',
      '.tif',
      '.bmp',
      '.jxr',
      '.psd'
    ].includes(path.extname(this.path).toLowerCase())
  }
  exists () {
    try {
      fs.lstatSync(this.path)
      return true
    } catch (e) {
      if (e.code === 'ENOENT') {
        return false
      }
      throw e
    }
  }
  listFiles (options = { recursive: false }) {
    const filepathes = fs.readdirSync(this.path)
    return filepathes.reduce((carry, filename) => {
      try {
        if (filename.match(/^\./)) {
          return carry
        }
        const file = new File(path.join(this.path, filename))
        if (!options.recursive || !file.isDirectory()) {
          return [...carry, file]
        }
        const files = file.listFiles(options)
        return [...carry, file, ...files]
      } catch (e) {
        return carry
      }
    }, [])
  }
  static listFiles (filepath, options = {}) {
    return (new File(filepath)).listFiles(options)
  }
}
