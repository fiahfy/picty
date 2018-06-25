export const post = (worker, args) => {
  return new Promise((resolve, reject) => {
    try {
      worker.onmessage = ({ data }) => {
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
