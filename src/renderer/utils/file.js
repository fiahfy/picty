import fs from 'fs'
import path from 'path'

export default class File {
  constructor (filepath) {
    this.stats = fs.lstatSync(filepath)
    this.name = path.basename(filepath)
    this.path = filepath
    this.size = this.stats.size
    this.mtime = this.stats.mtime
  }
  get parent () {
    return new File(path.direname(this.path))
  }
  isDirectory () {
    return this.stats.isDirectory()
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
