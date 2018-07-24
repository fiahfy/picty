<template>
  <v-toolbar
    class="viewer-toolbar"
    flat
    dense
  >
    <v-btn
      :title="'View previous image'|accelerator('Left')"
      flat
      icon
      @click="onPreviousClick"
    >
      <v-icon>skip_previous</v-icon>
    </v-btn>

    <v-btn
      :title="'View next image'|accelerator('Right')"
      flat
      icon
      @click="onNextClick"
    >
      <v-icon>skip_next</v-icon>
    </v-btn>

    <span class="px-3">{{ page }} / {{ maxPage }}</span>

    <v-slider
      v-if="!loading"
      v-model="page"
      :min="1"
      :max="maxPage"
      class="px-3"
      hide-details
    />

    <v-spacer />

    <v-menu
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
      >
        <v-icon>zoom_in</v-icon>
      </v-btn>
      <v-toolbar
        ref="toolbar"
        flat
        dense
      >
        <v-btn
          :title="'Zoom in'|accelerator('CmdOrCtrl+Plus')"
          flat
          icon
          @click="onZoomInClick"
        >
          <v-icon>zoom_in</v-icon>
        </v-btn>
        <span class="px-3">{{ percentage }}%</span>
        <v-btn
          :title="'Zoom out'|accelerator('CmdOrCtrl+-')"
          flat
          icon
          @click="onZoomOutClick"
        >
          <v-icon>zoom_out</v-icon>
        </v-btn>
        <v-btn
          :title="'Reset'|accelerator('CmdOrCtrl+0')"
          flat
          @click="onResetClick"
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
      @click="onExitFullscreenClick"
    >
      <v-icon>fullscreen_exit</v-icon>
    </v-btn>
    <v-btn
      v-else
      title="Fullscreen"
      flat
      icon
      @click="onFullscreenClick"
    >
      <v-icon>fullscreen</v-icon>
    </v-btn>

    <v-btn
      :title="'Close'|accelerator('Esc')"
      flat
      icon
      @click="onCloseClick"
    >
      <v-icon>close</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data () {
    return {
      hovered: false,
      menu: false
    }
  },
  computed: {
    page: {
      get () {
        return this.$store.getters['local/viewer/currentFileIndex'] + 1
      },
      set (value) {
        this.$store.dispatch('local/viewer/moveFileIndex', { index: value - 1 })
      }
    },
    maxPage () {
      return this.files.length
    },
    percentage () {
      return Math.floor(this.scale * 100)
    },
    ...mapState([
      'fullScreen'
    ]),
    ...mapState('local/viewer', [
      'loading',
      'files',
      'scale'
    ])
  },
  methods: {
    onPreviousClick () {
      this.movePreviousFile()
    },
    onNextClick () {
      this.moveNextFile()
    },
    onZoomInClick () {
      this.zoomIn()
    },
    onZoomOutClick () {
      this.zoomOut()
    },
    onResetClick () {
      this.resetZoom()
    },
    onExitFullscreenClick () {
      this.leaveFullScreen()
    },
    onFullscreenClick () {
      this.enterFullScreen()
    },
    onCloseClick () {
      this.dismissViewer()
    },
    hideMenu () {
      this.menu = false
    },
    isHover () {
      return !!(this.$el.querySelector(':hover') || this.$refs.toolbar.$el.querySelector(':hover'))
    },
    ...mapActions([
      'enterFullScreen',
      'leaveFullScreen',
      'dismissViewer'
    ]),
    ...mapActions('local/viewer', [
      'movePreviousFile',
      'moveNextFile',
      'zoomIn',
      'zoomOut',
      'resetZoom'
    ])
  }
}
</script>

<style scoped lang="scss">
.viewer-toolbar /deep/ .v-input--slider {
  left: 0;
  position: absolute;
  right: 0;
  top: 1px;
  .v-slider {
    height: 0;
  }
}
</style>
