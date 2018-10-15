<template>
  <v-container class="settings">
    <v-subheader>General</v-subheader>
    <v-container>
      <v-checkbox
        v-model="darkTheme"
        label="Use dark theme"
      />
      <v-combobox
        v-model="extensions"
        :items="defaultExtensions"
        label="Filter extensions"
        chips
        multiple
      >
        <template
          slot="selection"
          slot-scope="data"
        >
          <v-chip
            :selected="data.selected"
            close
            @input="onChipInput(data.item)"
          >
            {{ data.item }}
          </v-chip>
        </template>
      </v-combobox>
    </v-container>

    <v-subheader>Explorer</v-subheader>
    <v-container>
      <v-select
        v-model="previewSize"
        :items="previewSizes"
        label="Preview size"
      />
      <v-select
        v-model="thumbnailStyle"
        :items="thumbnailStyles"
        label="Thumbnail style"
      />
      <v-select
        v-model="thumbnailHeight"
        :items="thumbnailHeights"
        label="Thumbnail height"
      />
    </v-container>

    <v-subheader>Viewer</v-subheader>
    <v-container>
      <v-checkbox
        v-model="fullScreen"
        label="View images in full screen"
      />
      <v-checkbox
        v-model="recursive"
        label="View images recursively"
      />
      <v-checkbox
        v-model="imageStretched"
        label="Stretch small images"
      />
    </v-container>
  </v-container>
</template>

<script>
import {
  defaultExtensions,
  previewSizes,
  thumbnailStyles,
  thumbnailHeights
} from '~/store/settings'

export default {
  data() {
    return {
      defaultExtensions,
      previewSizes: Object.keys(previewSizes).map((size) => ({
        value: size,
        text: size.charAt(0).toUpperCase() + size.slice(1)
      })),
      thumbnailStyles: thumbnailStyles.map((style) => ({
        value: style,
        text: style.charAt(0).toUpperCase() + style.slice(1)
      })),
      thumbnailHeights: Object.keys(thumbnailHeights).map((height) => ({
        value: height,
        text: height.charAt(0).toUpperCase() + height.slice(1)
      }))
    }
  },
  computed: {
    darkTheme: {
      get() {
        return this.$store.state.settings.darkTheme
      },
      set(value) {
        this.$store.commit('settings/setDarkTheme', { darkTheme: value })
      }
    },
    fullScreen: {
      get() {
        return this.$store.state.settings.fullScreen
      },
      set(value) {
        this.$store.commit('settings/setFullScreen', { fullScreen: value })
      }
    },
    recursive: {
      get() {
        return this.$store.state.settings.recursive
      },
      set(value) {
        this.$store.commit('settings/setRecursive', { recursive: value })
      }
    },
    imageStretched: {
      get() {
        return this.$store.state.settings.imageStretched
      },
      set(value) {
        this.$store.commit('settings/setImageStretched', {
          imageStretched: value
        })
      }
    },
    previewSize: {
      get() {
        return this.$store.state.settings.previewSize
      },
      set(value) {
        this.$store.commit('settings/setPreviewSize', { previewSize: value })
      }
    },
    thumbnailStyle: {
      get() {
        return this.$store.state.settings.thumbnailStyle
      },
      set(value) {
        this.$store.commit('settings/setThumbnailStyle', {
          thumbnailStyle: value
        })
      }
    },
    thumbnailHeight: {
      get() {
        return this.$store.state.settings.thumbnailHeight
      },
      set(value) {
        this.$store.commit('settings/setThumbnailHeight', {
          thumbnailHeight: value
        })
      }
    },
    extensions: {
      get() {
        return this.$store.state.settings.extensions.map((item) =>
          item.toUpperCase()
        )
      },
      set(value) {
        this.$store.commit('settings/setExtensions', {
          extensions: value.map((item) => item.toUpperCase())
        })
      }
    }
  },
  methods: {
    onChipInput(item) {
      this.extensions = this.extensions.filter(
        (extension) => extension !== item
      )
    }
  }
}
</script>
