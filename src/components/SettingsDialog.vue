<template>
  <v-dialog
    v-model="state.active"
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
              <v-btn title="Close" icon @click="handleClickClose">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-toolbar-title>Settings</v-toolbar-title>
            </v-toolbar>
            <v-container fill-height align-start overflow-y-auto>
              <div class="d-flex flex-column">
                <v-subheader class="pl-0 text-uppercase">General</v-subheader>
                <v-checkbox
                  v-model="darkTheme"
                  class="mt-0"
                  label="Dark Theme"
                  dense
                />
                <v-combobox
                  v-model="extensions"
                  :items="defaultExtensions"
                  label="Image File Extensions"
                  chips
                  multiple
                  dense
                  class="pt-3"
                >
                  <template v-slot:selection="data">
                    <v-chip
                      :input-value="data.selected"
                      close
                      class="my-1"
                      @click:close="handleCloseChip(data.item)"
                    >
                      {{ data.item }}
                    </v-chip>
                  </template>
                </v-combobox>

                <v-subheader class="pl-0 text-uppercase">
                  Explorer
                </v-subheader>
                <v-text-field
                  v-model="queryHistorySize"
                  label="Search History Size"
                  type="number"
                  dense
                  class="pt-3"
                >
                  <v-btn
                    slot="append-outer"
                    color="primary"
                    text
                    @click="handleClearHistories"
                  >
                    Clear All Histories
                  </v-btn>
                </v-text-field>
                <v-select
                  v-model="previewWidth"
                  :items="previewWidths"
                  label="Preview Width"
                  dense
                  class="pt-3"
                />
                <v-select
                  v-model="thumbnailStyle"
                  :items="thumbnailStyles"
                  label="Thumbnail Style"
                  dense
                  class="pt-3"
                />
                <v-select
                  v-model="thumbnailHeight"
                  :items="thumbnailHeights"
                  label="Thumbnail Height"
                  dense
                  class="pt-3"
                />

                <v-subheader class="pl-0 text-uppercase">Viewer</v-subheader>
                <v-checkbox
                  v-model="fullScreen"
                  class="mt-0"
                  label="Enter Full Screen"
                  dense
                />
                <v-checkbox
                  v-model="recursive"
                  class="mt-0"
                  label="View Images Recursively"
                  dense
                />
                <v-checkbox
                  v-model="imageStretched"
                  class="mt-0"
                  label="Stretch Small Images"
                  dense
                />
              </div>
            </v-container>
          </v-layout>
        </v-content>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  reactive,
  onMounted,
  onUnmounted,
  SetupContext,
} from '@vue/composition-api'
import TitleBar from '~/components/TitleBar.vue'
import { settingsStore, queryHistoryStore } from '~/store'

const settings = require('~/consts/settings')

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

export default defineComponent({
  components: {
    TitleBar,
  },
  setup(_props: {}, context: SetupContext) {
    const state = reactive({
      active: false,
    })

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

    const show = () => {
      state.active = true
    }

    const handleClickClose = () => {
      state.active = false
    }
    const handleCloseChip = (item: string) => {
      extensions.value = extensions.value.filter(
        (extension) => extension !== item
      )
    }
    const handleClearHistories = () => {
      queryHistoryStore.clearHistory()
    }

    onMounted(() => {
      context.root.$eventBus.$on('show-settings', show)
    })

    onUnmounted(() => {
      context.root.$eventBus.$off('show-settings', show)
    })

    return {
      state,
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
      handleClickClose,
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
