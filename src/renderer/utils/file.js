import fs from 'fs'
import path from 'path'

export async function listFiles (dir) {
  try {
    const files = fs.readdirSync(dir)
    return files.map(file => {
      try {
        const stats = fs.lstatSync(path.join(dir, file))
        return {
          name: file,
          path: path.join(dir, file),
          stats
        }
      } catch (e) {
        return null
      }
    }).filter(file => file)
  } catch (e) {
    return []
  }
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
