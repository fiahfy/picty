<template>
  <v-toolbar
    class="control-bar"
    flat
    dense
  >
    <v-btn
      :title="'View previous image'|accelerator('Left')"
      flat
      icon
      color="primary"
      @click="movePrevious"
    >
      <v-icon>skip_previous</v-icon>
    </v-btn>
    <v-btn
      :title="'View next image'|accelerator('Right')"
      flat
      icon
      color="primary"
      @click="moveNext"
    >
      <v-icon>skip_next</v-icon>
    </v-btn>
    <v-slider
      v-model="page"
      :min="1"
      :max="maxPage"
      hide-details
      class="pt-0 px-3"
    />
    <span class="px-3">{{ page }} / {{ maxPage }}</span>
    <v-menu
      :close-on-click="false"
      :close-on-content-click="false"
      v-model="menu"
      top
      offset-y
      nudge-top="12"
    >
      <v-btn
        slot="activator"
        title="Zoom"
        flat
        icon
        color="primary"
        @click="toggleZoomMenu"
      >
        <v-icon>zoom_in</v-icon>
      </v-btn>
      <v-toolbar
        flat
        dense
      >
        <v-btn
          :title="'Zoom in'|accelerator('CmdOrCtrl+Plus')"
          flat
          icon
          color="primary"
          @click="zoomIn"
        >
          <v-icon>zoom_in</v-icon>
        </v-btn>
        <v-btn
          :title="'Zoom out'|accelerator('CmdOrCtrl+-')"
          flat
          icon
          color="primary"
          @click="zoomOut"
        >
          <v-icon>zoom_out</v-icon>
        </v-btn>
        <v-btn
          :title="'Reset'|accelerator('CmdOrCtrl+0')"
          flat
          color="primary"
          @click="resetZoom"
        >
          Reset
        </v-btn>
      </v-toolbar>
    </v-menu>
    <v-btn
      v-if="fullScreen"
      title="Exit fullscreen"
      flat
      icon
      color="primary"
      @click="leaveFullScreen"
    >
      <v-icon>fullscreen_exit</v-icon>
    </v-btn>
    <v-btn
      v-else
      title="Fullscreen"
      flat
      icon
      color="primary"
      @click="enterFullScreen"
    >
      <v-icon>fullscreen</v-icon>
    </v-btn>
    <v-btn
      :title="'Close'|accelerator('Esc')"
      flat
      icon
      color="primary"
      @click="dismiss"
    >
      <v-icon>close</v-icon>
    </v-btn>
  </v-toolbar>
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
      menu: false
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
// @import "@material/animation/functions";
// @import "@material/button/mixins";
// @import "@material/ripple/mixins";

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

// .fade-in {
//   animation: mdc-animation-enter(fade-in, 350ms) forwards;
// }
// .fade-out {
//   animation: mdc-animation-enter(fade-out, 350ms) forwards;
// }

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
    // @include mdc-button-ink-color(white);
    // @include mdc-states(white);
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
