<template>
  <div class="settings">
    <h4>Viewer</h4>
    <mdc-form-field>
      <mdc-checkbox id="full-screen" v-model="fullScreen"/>
      <label for="full-screen">View in full screen</label>
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
    fullScreen: {
      get () {
        return this.$store.state.settings.fullScreen
      },
      set (value) {
        this.$store.commit('setFullScreen', value)
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
