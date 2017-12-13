<template>
  <div class="control-bar">
    <div class="background" />
    <div class="container">
      <mdc-button
        title="View previous image"
        @click.native="viewPreviousImage"
      >
        <mdc-icon icon="skip_previous" />
      </mdc-button>
      <mdc-button
        title="View next image"
        @click.native="viewNextImage"
      >
        <mdc-icon icon="skip_next" />
      </mdc-button>
      <mdc-slider v-model="page" :min="1" :max="maxPage" />
      <div class="page">{{ page }} / {{ maxPage }}</div>
      <mdc-button
        title="Exit fullscreen"
        @click.native="leaveFullScreen"
        v-if="fullScreen"
      >
        <mdc-icon icon="fullscreen_exit" />
      </mdc-button>
      <mdc-button
        title="Fullscreen"
        @click.native="enterFullScreen"
        v-else
      >
        <mdc-icon icon="fullscreen" />
      </mdc-button>
      <mdc-button
        title="Close"
        @click.native="dismiss"
      >
        <mdc-icon icon="close" />
      </mdc-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
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
        return this.$store.getters['viewer/currentIndex'] + 1
      },
      set (value) {
        this.$store.commit('viewer/setCurrentIndex', { index: value - 1 })
      }
    },
    ...mapState([
      'fullScreen'
    ]),
    ...mapState('viewer', {
      maxPage: state => state.files.length
    })
  },
  methods: {
    ...mapActions([
      'enterFullScreen',
      'leaveFullScreen'
    ]),
    ...mapActions('viewer', [
      'dismiss',
      'viewPreviousImage',
      'viewNextImage'
    ])
  }
}
</script>

<style scoped lang="scss">
@import "~@material/button/mixins";
@import "~@material/ripple/mixins";

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
  padding: 4px;
}
.mdc-button {
  height: auto;
  line-height: initial;
  margin: 8px;
  min-width: 32px;
  padding: 0;
  &:not(:first-child) {
    margin-left: 0px;
  }
  @include mdc-button-ink-color(white);
  @include mdc-states(white);
}
.mdc-slider {
  margin-left: 16px;
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
