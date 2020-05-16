<template>
  <v-container class="settings" fill-height fluid pa-0 scroll-y>
    <v-layout>
      <v-container class="my-0">
        <v-subheader class="pl-0">GENERAL</v-subheader>
        <v-checkbox v-model="darkTheme" class="mt-0" label="Dark Theme" />
        <v-combobox
          v-model="extensions"
          :items="defaultExtensions"
          label="Image File Extensions"
          chips
          multiple
        >
          <template slot="selection" slot-scope="data">
            <v-chip
              :input-value="data.selected"
              close
              @input="onChipInput(data.item)"
            >
              {{ data.item }}
            </v-chip>
          </template>
        </v-combobox>

        <v-subheader class="pl-0">EXPLORER</v-subheader>
        <v-text-field
          v-model="queryHistorySize"
          label="Search History Size"
          type="number"
        >
          <v-btn
            slot="append-outer"
            class="mt-0"
            color="primary"
            text
            @click="onClearClick"
          >
            Clear All Histories
          </v-btn>
        </v-text-field>
        <v-select
          v-model="previewWidth"
          :items="previewWidths"
          label="Preview Width"
        />
        <v-select
          v-model="thumbnailStyle"
          :items="thumbnailStyles"
          label="Thumbnail Style"
        />
        <v-select
          v-model="thumbnailHeight"
          :items="thumbnailHeights"
          label="Thumbnail Height"
        />

        <v-subheader class="pl-0">VIEWER</v-subheader>
        <v-checkbox
          v-model="fullScreen"
          class="mt-0"
          label="Enter Full Screen"
        />
        <v-checkbox
          v-model="recursive"
          class="mt-0"
          label="View Images Recursively"
        />
        <v-checkbox
          v-model="imageStretched"
          class="mt-0"
          label="Stretch Small Images"
        />
      </v-container>
    </v-layout>
  </v-container>
</template>

<script>
import { settingsStore } from '~/store'

const settings = require('~/consts/settings')

export default {
  data() {
    return {
      defaultExtensions: settings.DEFAULT_EXTENSIONS,
      previewWidths: Object.keys(settings.PREVIEW_WIDTHS).map((size) => ({
        value: size,
        text: size.charAt(0).toUpperCase() + size.slice(1),
      })),
      thumbnailStyles: settings.THUMBNAIL_STYLES.map((style) => ({
        value: style,
        text: style.charAt(0).toUpperCase() + style.slice(1),
      })),
      thumbnailHeights: Object.keys(settings.THUMBNAIL_HEIGHTS).map(
        (height) => ({
          value: height,
          text: height.charAt(0).toUpperCase() + height.slice(1),
        })
      ),
    }
  },
  computed: {
    darkTheme: {
      get() {
        return settingsStore.darkTheme
      },
      set(value) {
        settingsStore.setDarkTheme({ darkTheme: value })
      },
    },
    fullScreen: {
      get() {
        return settingsStore.fullScreen
      },
      set(value) {
        settingsStore.setFullScreen({ fullScreen: value })
      },
    },
    recursive: {
      get() {
        return settingsStore.recursive
      },
      set(value) {
        settingsStore.setRecursive({ recursive: value })
      },
    },
    imageStretched: {
      get() {
        return settingsStore.imageStretched
      },
      set(value) {
        settingsStore.setImageStretched({
          imageStretched: value,
        })
      },
    },
    queryHistorySize: {
      get() {
        return settingsStore.queryHistorySize
      },
      set(value) {
        settingsStore.setQueryHistorySize({
          queryHistorySize: value,
        })
      },
    },
    previewWidth: {
      get() {
        return settingsStore.previewWidth
      },
      set(value) {
        settingsStore.setPreviewWidth({ previewWidth: value })
      },
    },
    thumbnailStyle: {
      get() {
        return settingsStore.thumbnailStyle
      },
      set(value) {
        settingsStore.setThumbnailStyle({
          thumbnailStyle: value,
        })
      },
    },
    thumbnailHeight: {
      get() {
        return settingsStore.thumbnailHeight
      },
      set(value) {
        settingsStore.setThumbnailHeight({
          thumbnailHeight: value,
        })
      },
    },
    extensions: {
      get() {
        return settingsStore.extensions.map((item) => item.toUpperCase())
      },
      set(value) {
        settingsStore.setExtensions({
          extensions: value.map((item) => item.toUpperCase()),
        })
      },
    },
  },
  methods: {
    onChipInput(item) {
      this.extensions = this.extensions.filter(
        (extension) => extension !== item
      )
    },
    onClearClick() {
      settingsStore.clearQueryHistory()
    },
  },
}
</script>
