import path from 'path'
import { Module, VuexModule, Mutation } from 'vuex-module-decorators'
import * as settings from '~/consts/settings'

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
  previewWidth = 'medium'
  thumbnailStyle = 'cover'
  thumbnailHeight = 'medium'
  extensions = [...settings.DEFAULT_EXTENSIONS]

  get previewWidthValue() {
    return settings.PREVIEW_WIDTHS[this.previewWidth]
  }

  get thumbnailHeightValue() {
    return settings.THUMBNAIL_HEIGHTS[this.thumbnailHeight]
  }

  get isFileAvailable() {
    return ({ filepath }: { filepath: string }) => {
      if (!filepath) {
        return false
      }
      const ext = path.extname(filepath).toUpperCase()
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
  setPreviewWidth({ previewWidth }: { previewWidth: string }) {
    this.previewWidth = previewWidth
  }

  @Mutation
  setThumbnailStyle({ thumbnailStyle }: { thumbnailStyle: string }) {
    this.thumbnailStyle = thumbnailStyle
  }

  @Mutation
  setThumbnailHeight({ thumbnailHeight }: { thumbnailHeight: string }) {
    this.thumbnailHeight = thumbnailHeight
  }

  @Mutation
  setExtensions({ extensions }: { extensions: string[] }) {
    this.extensions = extensions
  }
}
