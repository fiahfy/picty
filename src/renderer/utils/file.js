import fs from 'fs'
import path from 'path'

export function readdirAsync (dir) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        reject(err)
      } else {
        resolve(files)
      }
    })
  })
}

export function lstatAsync (file) {
  return new Promise((resolve, reject) => {
    fs.lstat(file, (err, stats) => {
      if (err) {
        reject(err)
      } else {
        resolve(stats)
      }
    })
  })
}

export async function listFiles (dir) {
  const files = await readdirAsync(dir)
  return Promise.all(
    files.map(async (file) => {
      const stats = await lstatAsync(path.join(dir, file))
      return {
        name: file,
        path: path.join(dir, file),
        stats
      }
    }),
  )
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
  return extensions.includes(path.extname(file))
}
