import { File } from '~/models/file'

export type Item = File & {
  rating: number
}
