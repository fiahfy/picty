import file from '~/utils/file'

onmessage = ({ data: { key, data } }) => {
  const filepath = file.getFirstChildPath(data)
  postMessage({ key, data: filepath })
}
