import * as File from '~/utils/file'

onmessage = ({ data: { method, args } }) => {
  const result = File[method](...args)
  postMessage(result)
}
