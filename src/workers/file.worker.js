import file from '~/utils/file'

onmessage = ({ data: { method, args } }) => {
  const result = file[method](...args)
  postMessage(result)
}
