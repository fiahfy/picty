import * as File from '~/utils/file'

const wait = (millis = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, millis)
  })
}

onmessage = async ({ data: { id, data } }) => {
  switch (id) {
    case 'listFiles': {
      await wait()
      const files = File.listFiles(...data)
      postMessage({ data: files })
      break
    }
    case 'getFiles': {
      await wait()
      const files = File.getFiles(...data)
      postMessage({ data: files })
      break
    }
    default:
      postMessage()
      break
  }
}
