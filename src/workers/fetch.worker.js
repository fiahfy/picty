import file from '~/utils/file'

onmessage = ({ data: { key, data } }) => {
  const filepathes = file.getChildPathes(data)
  postMessage({ key, data: filepathes })
}
