export default interface File {
  path: string
  name: string
  dirpath: string
  dirname: string
  exists: boolean
  directory: boolean
  file: boolean
  link: boolean
  createdAt?: number
  modifiedAt?: number
  accessedAt?: number
}
