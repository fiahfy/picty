<template>
  <v-dialog
    v-model="state.active"
    class="settings-dialog"
    fullscreen
    hide-overlay
    eager
    :transition="false"
  >
    <v-card flat tile class="d-flex flex-column fill-height">
      <title-bar :app="false" />
      <v-toolbar flat dense>
        <v-btn title="Close" icon @click="handleClickClose">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Settings</v-toolbar-title>
      </v-toolbar>
      <div class="fill-height overflow-y-auto">
        <v-container>
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
                  @click:close="() => handleCloseChip(data.item)"
                >
                  {{ data.item }}
                </v-chip>
              </template>
            </v-combobox>

            <v-subheader class="pl-0 text-uppercase">
              Explorer
            </v-subheader>
            <v-select
              v-model="thumbnailStyle"
              :items="thumbnailStyleOptions"
              label="Thumbnail Style"
              dense
              class="pt-3"
            />
            <v-select
              v-model="thumbnailHeight"
              :items="thumbnailHeightOptions"
              label="Thumbnail Height"
              dense
              class="pt-3"
            />

            <v-subheader class="pl-0 text-uppercase">
              Presentation
            </v-subheader>
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
      </div>
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
} from '@nuxtjs/composition-api'
import { settingsStore } from '~/store'
import {
  defaultExtensions,
  thumbnailStyles,
  thumbnailHeights,
} from '~/store/settings'

const thumbnailStyleOptions = thumbnailStyles.map((style: string) => ({
  value: style,
  text: style.charAt(0).toUpperCase() + style.slice(1),
}))

const thumbnailHeightOptions = Object.keys(thumbnailHeights).map((height) => ({
  value: height,
  text: height.charAt(0).toUpperCase() + height.slice(1),
}))

export default defineComponent({
  setup(_props: unknown, context: SetupContext) {
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

    onMounted(() => {
      context.root.$eventBus.$on('show-settings', show)
    })

    onUnmounted(() => {
      context.root.$eventBus.$off('show-settings', show)
    })

    return {
      state,
      defaultExtensions,
      thumbnailStyleOptions,
      thumbnailHeightOptions,
      darkTheme,
      fullScreen,
      recursive,
      imageStretched,
      thumbnailStyle,
      thumbnailHeight,
      extensions,
      handleClickClose,
      handleCloseChip,
    }
  },
})
</script>
