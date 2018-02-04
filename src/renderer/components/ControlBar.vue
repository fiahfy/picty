<template>
  <div class="control-bar">
    <div class="background" />
    <div class="container">
      <mdc-button
        class="icon previous"
        title="View previous image"
        @click="viewPreviousImage"
      >
        <mdc-icon icon="skip_previous" />
      </mdc-button>
      <mdc-button
        class="icon next"
        title="View next image"
        @click="viewNextImage"
      >
        <mdc-icon icon="skip_next" />
      </mdc-button>
      <mdc-slider v-model="page" :min="1" :max="maxPage" />
      <div>{{ page }} / {{ maxPage }}</div>
      <mdc-button
        class="icon"
        title="Zoom"
        @click="toggleZoomMenu"
      >
        <mdc-icon icon="zoom_in" />
      </mdc-button>
      <template v-if="fullScreenAvailable">
        <mdc-button
          class="icon"
          title="Exit fullscreen"
          @click="leaveFullScreen"
          v-if="fullScreen"
        >
          <mdc-icon icon="fullscreen_exit" />
        </mdc-button>
        <mdc-button
          class="icon"
          title="Fullscreen"
          @click="enterFullScreen"
          v-else
        >
          <mdc-icon icon="fullscreen" />
        </mdc-button>
      </template>
      <mdc-button
        class="icon"
        title="Close"
        @click="dismiss"
      >
        <mdc-icon icon="close" />
      </mdc-button>
    </div>
    <div class="menu" :class="zoomMenuClasses">
      <div class="background" />
      <div class="container">
        <mdc-button
          class="icon"
          title="Zoom in"
          @click="zoomIn"
        >
          <mdc-icon icon="zoom_in" />
        </mdc-button>
        <div class="scale">{{ scale }}%</div>
        <mdc-button
          class="icon"
          title="Zoom out"
          @click="zoomOut"
        >
          <mdc-icon icon="zoom_out" />
        </mdc-button>
        <mdc-button
          title="Reset"
          @click="resetZoom"
        >
          Reset
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
    ...mapState({
      fullScreen: state => state.fullScreen,
      maxPage: state => state.viewer.files.length,
      scale: state => Math.floor(state.viewer.scale * 100)
    }),
    ...mapGetters({
      fullScreenAvailable: 'fullScreenAvailable'
    })
  },
  methods: {
    toggleZoomMenu () {
      this.zoomMenuHidden = !this.zoomMenuHidden
    },
    ...mapActions({
      enterFullScreen: 'enterFullScreen',
      leaveFullScreen: 'leaveFullScreen',
      dismiss: 'viewer/dismiss',
      viewPreviousImage: 'viewer/viewPreviousImage',
      viewNextImage: 'viewer/viewNextImage',
      zoomIn: 'viewer/zoomIn',
      zoomOut: 'viewer/zoomOut',
      resetZoom: 'viewer/resetZoom'
    })
  }
}
</script>

<style scoped lang="scss">
@import "~@material/animation/functions";
@import "~@material/button/mixins";
@import "~@material/ripple/mixins";

@keyframes fade-in {
  0% {
    opacity: 0;
    visibility: hidden;
  }
  100% {
    opacity: 1;
    visibility: visible;
  }
}
@keyframes fade-out {
  0% {
    opacity: 1;
    visibility: visible;
  }
  100% {
    opacity: 0;
    visibility: hidden;
  }
}

.fade-in {
  animation: mdc-animation-enter(fade-in, 350ms) forwards;
}
.fade-out {
  animation: mdc-animation-enter(fade-out, 350ms) forwards;
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
.container>div {
  color: white;
  line-height: 48px;
  margin: 0 12px;
  vertical-align: bottom;
  white-space: nowrap;
  z-index: 1;
}
.container>.scale {
  margin-left: 0;
  text-align: center;
  width: 35px;
}
.mdc-button {
  margin: 6px 8px;
  @include mdc-button-ink-color(white);
  @include mdc-states(white);
}
.mdc-button:not(:first-child) {
  margin-left: 0;
}
.menu {
  bottom: 56px;
  position:absolute;
  right: 8px;
}
</style>
