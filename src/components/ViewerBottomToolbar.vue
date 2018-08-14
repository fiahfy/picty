<template>
  <v-toolbar
    class="viewer-bottom-toolbar"
    color="transparent"
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

    <span class="px-3 ellipsis">{{ page }} / {{ maxPage }}</span>

    <v-slider
      v-if="!loading"
      ref="slider"
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
      :title="fullScreen ? 'Exit fullscreen' : 'Fullscreen'"
      flat
      icon
      @click="onFullscreenClick"
    >
      <v-icon>{{ fullScreen ? 'fullscreen_exit' : 'fullscreen' }}</v-icon>
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
        this.$store.dispatch('local/viewer/moveFile', { index: value - 1 })
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
  watch: {
    page () {
      this.$refs.slider && this.$refs.slider.$el.querySelector('input').blur()
    }
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
    onFullscreenClick () {
      this.toggleFullScreen()
    },
    hideMenu () {
      this.menu = false
    },
    isHover () {
      return !!(this.$el.querySelector(':hover') || this.$refs.toolbar.$el.querySelector(':hover'))
    },
    ...mapActions('local/viewer', [
      'movePreviousFile',
      'moveNextFile',
      'zoomIn',
      'zoomOut',
      'resetZoom',
      'toggleFullScreen'
    ])
  }
}
</script>

<style scoped lang="scss">
.viewer-bottom-toolbar /deep/ .v-input--slider {
  left: 0;
  position: absolute;
  right: 0;
  top: 1px;
  z-index: 1;
  .v-slider {
    height: 0;
  }
}
</style>
