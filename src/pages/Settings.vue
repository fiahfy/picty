<template>
  <v-container class="settings">
    <v-subheader class="pa-0">General</v-subheader>
    <v-checkbox
      v-model="darkTheme"
      label="Use dark theme"
    />
    <v-combobox
      v-model="extensions"
      :items="defaults"
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

    <v-subheader class="pa-0">Viewer</v-subheader>
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
    <v-checkbox
      v-model="children"
      label="children"
    />
  </v-container>
</template>

<script>
import { defaultExtensions } from '~/store/settings'

export default {
  data () {
    return {
      defaults: defaultExtensions
    }
  },
  computed: {
    darkTheme: {
      get () {
        return this.$store.state.settings.darkTheme
      },
      set (value) {
        this.$store.commit('settings/setDarkTheme', { darkTheme: value })
      }
    },
    fullScreen: {
      get () {
        return this.$store.state.settings.fullScreen
      },
      set (value) {
        this.$store.commit('settings/setFullScreen', { fullScreen: value })
      }
    },
    recursive: {
      get () {
        return this.$store.state.settings.recursive
      },
      set (value) {
        this.$store.commit('settings/setRecursive', { recursive: value })
      }
    },
    imageStretched: {
      get () {
        return this.$store.state.settings.imageStretched
      },
      set (value) {
        this.$store.commit('settings/setImageStretched', { imageStretched: value })
      }
    },
    children: {
      get () {
        return this.$store.state.settings.children
      },
      set (value) {
        this.$store.commit('settings/setChildren', { children: value })
      }
    },
    extensions: {
      get () {
        return this.$store.state.settings.extensions.map((item) => item.toUpperCase())
      },
      set (value) {
        this.$store.commit('settings/setExtensions', { extensions: value.map((item) => item.toUpperCase()) })
      }
    }
  },
  methods: {
    onChipInput (item) {
      this.extensions = this.extensions.filter((extension) => extension !== item)
    }
  }
}
</script>
