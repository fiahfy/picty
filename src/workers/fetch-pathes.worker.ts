import fs from 'fs'
import path from 'path'

const ctx: Worker = self as any // eslint-disable-line @typescript-eslint/no-explicit-any

ctx.addEventListener('message', ({ data: { key, data: dirPath } }) => {
  const filePathes = fs.readdirSync(dirPath).reduce((carry, filename) => {
    if (filename.match(/^\./)) {
      return carry
    }
    return [...carry, path.join(dirPath, filename)]
  }, [] as string[])
  ctx.postMessage({ key, data: filePathes })
})
