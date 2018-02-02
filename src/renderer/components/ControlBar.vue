<template>
  <div class="control-bar">
    <div class="background" />
    <div class="container">
      <mdc-button
        title="View previous image"
        class="previous"
        @click="viewPreviousImage"
      >
        <mdc-icon icon="skip_previous" />
      </mdc-button>
      <mdc-button
        title="View next image"
        class="next"
        @click="viewNextImage"
      >
        <mdc-icon icon="skip_next" />
      </mdc-button>
      <mdc-slider v-model="page" :min="1" :max="maxPage" />
      <div>{{ page }} / {{ maxPage }}</div>
      <mdc-button
        title="Zoom"
        @click="toggleZoomMenu"
      >
        <mdc-icon icon="zoom_in" />
      </mdc-button>
      <template v-if="fullScreenAvailable">
        <mdc-button
          title="Exit fullscreen"
          @click="leaveFullScreen"
          v-if="fullScreen"
        >
          <mdc-icon icon="fullscreen_exit" />
        </mdc-button>
        <mdc-button
          title="Fullscreen"
          @click="enterFullScreen"
          v-else
        >
          <mdc-icon icon="fullscreen" />
        </mdc-button>
      </template>
      <mdc-button
        title="Close"
        @click="dismiss"
      >
        <mdc-icon icon="close" />
      </mdc-button>
    </div>
    <div class="zoom-menu" :class="zoomMenuClasses">
      <div class="background" />
      <div class="container">
        <mdc-button
          title="Zoom in"
          @click="zoomIn"
        >
          <mdc-icon icon="zoom_in" />
        </mdc-button>
        <div class="scale">{{ scale }}%</div>
        <mdc-button
          title="Zoom out"
          @click="zoomOut"
        >
          <mdc-icon icon="zoom_out" />
        </mdc-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import MdcButton from '../components/MdcButton'
import MdcIcon from '../components/MdcIcon'
import MdcSlider from '../components/MdcSlider'

export default {
  components: {
    MdcButton,
    MdcIcon,
    MdcSlider
  },
  data () {
    return {
      zoomMenuHidden: true
    }
  },
  computed: {
    page: {
      get () {
        return this.$store.getters['viewer/currentIndex'] + 1
      },
      set (value) {
        this.$store.commit('viewer/setCurrentIndex', { currentIndex: value - 1 })
      }
    },
    zoomMenuClasses () {
      return {
        'fade-in': !this.zoomMenuHidden,
        'fade-out': this.zoomMenuHidden
      }
    },
    ...mapState([
      'fullScreen'
    ]),
    ...mapState('viewer', {
      maxPage: state => state.files.length,
      scale: state => state.scale
    }),
    ...mapGetters([
      'fullScreenAvailable'
    ])
  },
  methods: {
    toggleZoomMenu () {
      this.zoomMenuHidden = !this.zoomMenuHidden
    },
    ...mapActions([
      'enterFullScreen',
      'leaveFullScreen'
    ]),
    ...mapActions('viewer', [
      'dismiss',
      'viewPreviousImage',
      'viewNextImage',
      'zoomIn',
      'zoomOut'
    ])
  }
}
</script>

<style scoped lang="scss">
@import "~@material/animation/functions";
@import "~@material/button/mixins";
@import "~@material/ripple/mixins";

@keyframes fade-in {
  0% {
    visibility: hidden;
    opacity: 0;
  }
  100% {
    visibility: visible;
    opacity: 1;
  }
}
@keyframes fade-out {
  0% {
    visibility: visible;
    opacity: 1;
  }
  100% {
    visibility: hidden;
    opacity: 0;
  }
}

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
.container>.mdc-button {
  border-radius: 0;
  height: auto;
  line-height: initial;
  margin: 8px;
  min-width: 32px;
  padding: 0;
  @include mdc-button-ink-color(white);
  @include mdc-states(white);
}
.container>div {
  color: white;
  line-height: 48px;
  margin: 0 8px;
  vertical-align: middle;
  white-space: nowrap;
  z-index: 1;
}
.container>.previous {
  margin-right: 0;
}
.container>.scale {
  margin: 0;
}
.zoom-menu {
  bottom: 56px;
  position:absolute;
  right: 8px;
}
.fade-in {
  animation: mdc-animation-enter(fade-in, 350ms) forwards;
}
.fade-out {
  animation: mdc-animation-enter(fade-out, 350ms) forwards;
}
</style>
