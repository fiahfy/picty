<template>
  <div class="settings">
    <h4>General</h4>
    <mdc-form-field>
      <mdc-checkbox id="dark-theme" v-model="darkTheme" />
      <label for="dark-theme">Use dark theme</label>
    </mdc-form-field>

    <h4>Viewer</h4>
    <mdc-form-field>
      <mdc-checkbox id="full-screen" v-model="fullScreen" />
      <label for="full-screen">View in full screen (Windows only)</label>
    </mdc-form-field>
  </div>
</template>

<script>
import MdcCheckbox from '../components/MdcCheckbox'
import MdcFormField from '../components/MdcFormField'

export default {
  components: {
    MdcCheckbox,
    MdcFormField
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
    }
  }
}
</script>

<style scoped lang="scss">
.settings {
  margin: 15px;
  text-align: left;
  user-select: none;
}
</style>
