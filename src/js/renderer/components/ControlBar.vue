<template>
  <div class="control-bar">
    <div class="background" />
    <div class="container">
      <mdc-button
        :title="'View previous image'|accelerator('Left')"
        class="previous"
        @click="movePrevious"
      >
        <mdc-icon
          slot="icon"
          icon="skip_previous"
        />
      </mdc-button>
      <mdc-button
        :title="'View next image'|accelerator('Right')"
        class="next"
        @click="moveNext"
      >
        <mdc-icon
          slot="icon"
          icon="skip_next"
        />
      </mdc-button>
      <mdc-slider
        v-model="page"
        :min="1"
        :max="maxPage"
      />
      <div>{{ page }} / {{ maxPage }}</div>
      <mdc-button
        title="Zoom"
        @click="toggleZoomMenu"
      >
        <mdc-icon
          slot="icon"
          icon="zoom_in"
        />
      </mdc-button>
      <mdc-button
        v-if="fullScreen"
        title="Exit fullscreen"
        @click="leaveFullScreen"
      >
        <mdc-icon
          slot="icon"
          icon="fullscreen_exit"
        />
      </mdc-button>
      <mdc-button
        v-else
        title="Fullscreen"
        @click="enterFullScreen"
      >
        <mdc-icon
          slot="icon"
          icon="fullscreen"
        />
      </mdc-button>
      <mdc-button
        :title="'Close'|accelerator('Esc')"
        @click="dismiss"
      >
        <mdc-icon
          slot="icon"
          icon="close"
        />
      </mdc-button>
    </div>
    <div
      :class="zoomMenuClasses"
      class="menu"
    >
      <div class="background" />
      <div class="container">
        <mdc-button
          :title="'Zoom in'|accelerator('CmdOrCtrl+Plus')"
          @click="zoomIn"
        >
          <mdc-icon
            slot="icon"
            icon="zoom_in"
          />
        </mdc-button>
        <div class="scale">{{ scale }}%</div>
        <mdc-button
          :title="'Zoom out'|accelerator('CmdOrCtrl+-')"
          @click="zoomOut"
        >
          <mdc-icon
            slot="icon"
            icon="zoom_out"
          />
        </mdc-button>
        <mdc-button
          :title="'Reset'|accelerator('CmdOrCtrl+0')"
          class="reset"
          @click="resetZoom"
        >
          Reset
        </mdc-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import MdcButton from './MdcButton'
import MdcIcon from './MdcIcon'
import MdcSlider from './MdcSlider'

export default {
  components: {
    MdcButton,
    MdcIcon,
    MdcSlider
  },
  data () {
    return {
      zoomMenuHidden: null
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
        'fade-in': this.zoomMenuHidden === false,
        'fade-out': this.zoomMenuHidden === true
      }
    },
    ...mapState({
      fullScreen: state => state.fullScreen,
      maxPage: state => state.viewer.files.length,
      scale: state => Math.floor(state.viewer.scale * 100)
    })
  },
  methods: {
    toggleZoomMenu () {
      this.zoomMenuHidden = this.zoomMenuHidden === null ? false : !this.zoomMenuHidden
    },
    ...mapActions({
      enterFullScreen: 'enterFullScreen',
      leaveFullScreen: 'leaveFullScreen',
      dismiss: 'viewer/dismiss',
      movePrevious: 'viewer/movePrevious',
      moveNext: 'viewer/moveNext',
      zoomIn: 'viewer/zoomIn',
      zoomOut: 'viewer/zoomOut',
      resetZoom: 'viewer/resetZoom'
    })
  }
}
</script>

<style scoped lang="scss">
@import "@material/animation/functions";
@import "@material/button/mixins";
@import "@material/ripple/mixins";

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
  &>div {
    color: white;
    line-height: 48px;
    margin: 0 12px;
    vertical-align: bottom;
    white-space: nowrap;
    z-index: 1;
    &.scale {
      margin-left: 0;
      text-align: center;
      width: 35px;
    }
  }
  .mdc-button {
    margin: 6px 8px;
    @include mdc-button-ink-color(white);
    @include mdc-states(white);
    &:not(:first-child) {
      margin-left: 0;
    }
    &:not(.reset) {
      min-width: 36px;
      padding: 0;
      .mdc-icon {
        font-size: 24px;
        height: auto;
        margin: 0;
        padding: 0;
        width: auto;
      }
    }
  }
  .menu {
    bottom: 56px;
    opacity: 0;
    position:absolute;
    right: 8px;
    visibility: hidden;
  }
}
</style>
