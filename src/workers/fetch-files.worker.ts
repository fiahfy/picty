import fs from 'fs'
import path from 'path'
import { File } from '~/models'

const ctx: Worker = self as any // eslint-disable-line @typescript-eslint/no-explicit-any

const getFile = (filePath: string): File => {
  const stat = fs.lstatSync(filePath)
  return {
    path: filePath,
    name: path.basename(filePath).normalize('NFC'),
    parent: path.dirname(filePath),
    directory: stat.isDirectory(),
    file: stat.isFile(),
    lastModified: stat.mtimeMs,
  }
}

const listFiles = (dirPath: string, recursive = false): File[] => {
  const filenames = fs.readdirSync(dirPath)
  return filenames.reduce((carry, filename) => {
    try {
      if (filename.match(/^\./)) {
        return carry
      }
      const filePath = path.join(dirPath, filename)
      const file = getFile(filePath)
      if (!recursive || !file.directory) {
        return [...carry, file]
      }
      const files = listFiles(filePath, recursive)
      return [...carry, file, ...files]
    } catch (e) {
      return carry
    }
  }, [] as File[])
}

ctx.addEventListener('message', ({ data: { dirPath, recursive } }) => {
  const files = listFiles(dirPath, recursive)
  ctx.postMessage(files)
})
