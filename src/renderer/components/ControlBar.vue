<template>
  <div class="control-bar">
    <div class="background"/>
    <div class="container">
      <mdc-button
        title="View previous image"
        @click="viewPreviousImage"
      >
        <mdc-icon icon="skip_previous"/>
      </mdc-button>
      <mdc-button
        title="View next image"
        @click="viewNextImage"
      >
        <mdc-icon icon="skip_next"/>
      </mdc-button>
      <mdc-slider v-model="page" :min="1" :max="maxPage"/>
      <div class="page">{{ page }} / {{ maxPage }}</div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import MdcButton from '../components/MdcButton'
import MdcIcon from '../components/MdcIcon'
import MdcSlider from '../components/MdcSlider'

export default {
  components: {
    MdcButton,
    MdcIcon,
    MdcSlider
  },
  computed: {
    page: {
      get () {
        return this.$store.state.viewer.currentIndex + 1
      },
      set (value) {
        this.$store.commit('viewer/setCurrentIndex', value - 1)
      }
    },
    ...mapState('viewer', {
      maxPage: state => state.files.length
    })
  },
  methods: {
    ...mapActions('viewer', [
      'changeFullscreen'
    ]),
    ...mapMutations('viewer', [
      'viewPreviousImage',
      'viewNextImage'
    ])
  }
}
</script>

<style scoped lang="scss">
.background {
  background-color: black;
  bottom: 0;
  left: 0;
  opacity: 0.4;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 0;
}
.container {
  display: flex;
}
.mdc-icon {
  color: white;
  padding: 4px;
}
.mdc-button {
  border-radius: 0;
  height: auto;
  line-height: initial;
  margin: 8px;
  min-width: 32px;
  padding: 0;
  &:first-child {
    margin-right: 0px;
  }
  &:nth-child(2) {
    margin-right: 16px;
  }
}
.page {
  color: white;
  font-size: smaller;
  line-height: 48px;
  margin: 0 16px;
  vertical-align: middle;
  white-space: nowrap;
  z-index: 1;
}
</style>
