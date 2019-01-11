import fileUtil from '~/utils/file'

onmessage = ({ data: { key, data } }) => {
  const filepathes = fileUtil.getChildPathes(data)
  postMessage({ key, data: filepathes })
}
