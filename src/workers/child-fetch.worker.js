import * as File from '~/utils/file'

onmessage = ({ data: { key, data } }) => {
  const filepath = File.getFirstChildPath(data)
  postMessage({ key, data: filepath })
}
