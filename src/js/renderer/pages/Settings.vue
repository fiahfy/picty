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
      label="View in full screen"
    />
    <v-checkbox
      v-model="imageStretched"
      label="Stretch small image"
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
    imageStretched: {
      get () {
        return this.$store.state.settings.imageStretched
      },
      set (value) {
        this.$store.commit('settings/setImageStretched', { imageStretched: value })
      }
    },
    fullScreen: {
      get () {
        return this.$store.state.settings.fullScreen
      },
      set (value) {
        this.$store.commit('settings/setFullScreen', { fullScreen: value })
      }
    }
  }
}
</script>
