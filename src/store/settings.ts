import path from 'path'
import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

export const defaultExtensions = [
  'BMP',
  'GIF',
  'ICO',
  'JPEG',
  'JPG',
  'PNG',
  'SVG',
  'TIF',
  'TIFF',
  'WEBP',
]

export const thumbnailHeights: { [key in ThumbnailHeight]: number } = {
  short: 128,
  medium: 192,
  tall: 256,
}

export const thumbnailStyles = ['cover', 'contain']

export type PreviewWidth = 'none' | 'narrow' | 'medium' | 'wide'
export type ThumbnailStyle = 'cover' | 'contain'
export type ThumbnailHeight = 'short' | 'medium' | 'tall'

@Module({
  name: 'settings',
  stateFactory: true,
  namespaced: true,
})
export default class SettingsModule extends VuexModule {
  darkTheme = false
  fullScreen = false
  recursive = false
  imageStretched = false
  queryHistorySize = 1000
  thumbnailStyle: ThumbnailStyle = 'cover'
  thumbnailHeight: ThumbnailHeight = 'medium'
  extensions = [...defaultExtensions]

  get thumbnailHeightValue() {
    return thumbnailHeights[this.thumbnailHeight]
  }

  get isFileAvailable() {
    return ({ filePath }: { filePath: string }) => {
      if (!filePath) {
        return false
      }
      const ext = path.extname(filePath).toUpperCase()
      if (!ext) {
        return false
      }
      return this.extensions.includes(ext.slice(1))
    }
  }

  @Mutation
  setDarkTheme({ darkTheme }: { darkTheme: boolean }) {
    this.darkTheme = darkTheme
  }

  @Mutation
  setFullScreen({ fullScreen }: { fullScreen: boolean }) {
    this.fullScreen = fullScreen
  }

  @Mutation
  setRecursive({ recursive }: { recursive: boolean }) {
    this.recursive = recursive
  }

  @Mutation
  setImageStretched({ imageStretched }: { imageStretched: boolean }) {
    this.imageStretched = imageStretched
  }

  @Mutation
  setQueryHistorySize({ queryHistorySize }: { queryHistorySize: number }) {
    this.queryHistorySize = queryHistorySize
  }

  @Mutation
  setThumbnailStyle({ thumbnailStyle }: { thumbnailStyle: ThumbnailStyle }) {
    this.thumbnailStyle = thumbnailStyle
  }

  @Mutation
  setThumbnailHeight({
    thumbnailHeight,
  }: {
    thumbnailHeight: ThumbnailHeight
  }) {
    this.thumbnailHeight = thumbnailHeight
  }

  @Mutation
  setExtensions({ extensions }: { extensions: string[] }) {
    this.extensions = extensions
  }
}
