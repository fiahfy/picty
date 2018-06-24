export const post = (worker, args) => {
  return new Promise((resolve, reject) => {
    try {
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

export const postAsync = (worker, args, callback) => {
  worker.onmessage = ({ data: { id, data } }) => {
    callback(data)
  }
  worker.postMessage(args)
}
