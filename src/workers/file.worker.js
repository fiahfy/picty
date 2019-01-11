import fileUtil from '~/utils/file'

onmessage = ({ data: { method, args } }) => {
  const result = fileUtil[method](...args)
  postMessage(result)
}
