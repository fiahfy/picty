<template>
  <v-dialog
    v-model="dialog"
    class="settings-dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card flat tile>
      <v-layout column fill-height>
        <title-bar :app="false" />
        <v-content class="fill-height px-0">
          <v-layout column fill-height>
            <v-toolbar flat dense>
              <v-btn title="Close" flat icon @click="onCloseClick">
                <v-icon>close</v-icon>
              </v-btn>
              <v-toolbar-title>Settings</v-toolbar-title>
            </v-toolbar>
            <v-container fill-height fluid pa-0 scroll-y>
              <v-layout>
                <v-container class="my-0">
                  <v-subheader class="pl-0">GENERAL</v-subheader>
                </v-container>
              </v-layout>
            </v-container>
          </v-layout>
        </v-content>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'
import { settingsStore, queryHistoryStore } from '~/store'

const settings = require('~/consts/settings')

export default defineComponent({
  setup() {
    const defaultExtensions = settings.DEFAULT_EXTENSIONS
    const previewWidths = Object.keys(settings.PREVIEW_WIDTHS).map((size) => ({
      value: size,
      text: size.charAt(0).toUpperCase() + size.slice(1),
    }))
    const thumbnailStyles = settings.THUMBNAIL_STYLES.map((style: string) => ({
      value: style,
      text: style.charAt(0).toUpperCase() + style.slice(1),
    }))
    const thumbnailHeights = Object.keys(settings.THUMBNAIL_HEIGHTS).map(
      (height) => ({
        value: height,
        text: height.charAt(0).toUpperCase() + height.slice(1),
      })
    )

    const darkTheme = computed({
      get: () => {
        return settingsStore.darkTheme
      },
      set: (value) => {
        settingsStore.setDarkTheme({ darkTheme: value })
      },
    })
    const fullScreen = computed({
      get: () => {
        return settingsStore.fullScreen
      },
      set: (value) => {
        settingsStore.setFullScreen({ fullScreen: value })
      },
    })
    const recursive = computed({
      get: () => {
        return settingsStore.recursive
      },
      set: (value) => {
        settingsStore.setRecursive({ recursive: value })
      },
    })
    const imageStretched = computed({
      get: () => {
        return settingsStore.imageStretched
      },
      set: (value) => {
        settingsStore.setImageStretched({ imageStretched: value })
      },
    })
    const queryHistorySize = computed({
      get: () => {
        return settingsStore.queryHistorySize
      },
      set: (value) => {
        settingsStore.setQueryHistorySize({ queryHistorySize: value })
      },
    })
    const previewWidth = computed({
      get: () => {
        return settingsStore.previewWidth
      },
      set: (value) => {
        settingsStore.setPreviewWidth({ previewWidth: value })
      },
    })
    const thumbnailStyle = computed({
      get: () => {
        return settingsStore.thumbnailStyle
      },
      set: (value) => {
        settingsStore.setThumbnailStyle({ thumbnailStyle: value })
      },
    })
    const thumbnailHeight = computed({
      get: () => {
        return settingsStore.thumbnailHeight
      },
      set: (value) => {
        settingsStore.setThumbnailHeight({ thumbnailHeight: value })
      },
    })
    const extensions = computed({
      get: () => {
        return settingsStore.extensions
      },
      set: (value) => {
        settingsStore.setExtensions({ extensions: value })
      },
    })

    const handleCloseChip = (item: string) => {
      extensions.value = extensions.value.filter(
        (extension) => extension !== item
      )
    }
    const handleClearHistories = () => {
      queryHistoryStore.clearHistory()
    }

    return {
      defaultExtensions,
      previewWidths,
      thumbnailStyles,
      thumbnailHeights,
      darkTheme,
      fullScreen,
      recursive,
      imageStretched,
      queryHistorySize,
      previewWidth,
      thumbnailStyle,
      thumbnailHeight,
      extensions,
      handleCloseChip,
      handleClearHistories,
    }
  },
})
</script>

<style scoped lang="scss">
.v-card {
  height: 100% !important;
}
</style>
