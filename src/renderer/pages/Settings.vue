<template>
  <div class="settings">
    <h4>Viewer</h4>
    <mdc-checkbox label="View in full screen" v-model="fullScreen" @change="setFullScreen"/>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import MdcCheckbox from '../components/MdcCheckbox'

export default {
  name: 'settings',
  components: {
    MdcCheckbox
  },
  computed: mapState({
    fullScreen: state => state.settings.fullScreen
  }),
  methods: mapMutations([
    'setFullScreen'
  ])
}
</script>

<style scoped lang="scss">
.settings {
  margin: 15px;
  text-align: left;
}
</style>
