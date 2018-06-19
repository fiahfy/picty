export const post = (Worker, args) => {
  return new Promise((resolve, reject) => {
    try {
      const worker = new Worker()
      worker.onmessage = ({ data: { id, data } }) => {
        resolve(data)
      }
      worker.postMessage(args)
    } catch (e) {
      console.error(e)
      reject(e)
    }
  })
}
