export const post = (Worker, args) => {
  return new Promise((resolve, reject) => {
    try {
      process.dlopen = () => {
        throw new Error('Load native module is not safe')
      }
      const worker = new Worker()
      worker.onmessage = ({ data: { id, data } }) => {
        resolve(data)
      }
      worker.onerror = (e) => {
        reject(e)
      }
      worker.postMessage(args)
    } catch (e) {
      reject(e)
    }
  })
}

export const postAsync = (Worker, args, callback) => {
  const worker = new Worker()
  worker.onmessage = ({ data: { id, data } }) => {
    callback(data)
  }
  worker.postMessage(args)
  return worker
}
