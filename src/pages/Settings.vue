<template>
  <v-container class="settings">
    <v-subheader class="pa-0">General</v-subheader>
    <v-checkbox
      v-model="darkTheme"
      label="Use dark theme"
    />
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
  </v-container>
</template>

<script>
export default {
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
    }
  }
}
</script>
