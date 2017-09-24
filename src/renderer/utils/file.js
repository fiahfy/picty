import fs from 'fs'
import path from 'path'

export function getFile (file) {
  const stats = fs.lstatSync(file)
  return {
    name: path.basename(file),
    path: file,
    stats
  }
}

export function listFiles (dir) {
  const files = fs.readdirSync(dir)
  return files.map(file => {
    if (file.match(/^\./)) {
      return null
    }
    try {
      return getFile(path.join(dir, file))
    } catch (e) {
      return null
    }
  }).filter(file => file)
}

export function isImage (file) {
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
