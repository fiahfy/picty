<template>
  <div class="settings">
    <h4>General</h4>
    <div>
      <mdc-form-field>
        <mdc-checkbox id="dark-theme" v-model="darkTheme" />
        <label for="dark-theme">Use dark theme</label>
      </mdc-form-field>
    </div>

    <h4>Viewer</h4>
    <div>
      <mdc-form-field>
        <mdc-checkbox id="image-stretched" v-model="imageStretched" />
        <label for="image-stretched">Stretch small image</label>
      </mdc-form-field>
    </div>
    <template v-if="fullScreenAvailable">
      <div>
        <mdc-form-field>
          <mdc-checkbox id="full-screen" v-model="fullScreen" />
          <label for="full-screen">View in full screen</label>
        </mdc-form-field>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
    },
    ...mapGetters({
      fullScreenAvailable: 'fullScreenAvailable'
    })
  }
}
</script>

<style scoped lang="scss">
.settings {
  margin: 15px;
  user-select: none;
}
</style>
