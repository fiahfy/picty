<template>
  <div class="settings">
    <h4>Viewer</h4>
    <mdc-checkbox label="View in full screen" v-model="fullScreen"/>
  </div>
</template>

<script>
import MdcCheckbox from '../components/MdcCheckbox'

export default {
  name: 'settings',
  components: {
    MdcCheckbox
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
}
</style>
