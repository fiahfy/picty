<template>
  <v-toolbar class="viewer-bottom-toolbar" color="transparent" flat dense>
    <v-btn
      :title="'View previous image' | accelerator('Left')"
      icon
      @click="onPreviousClick"
    >
      <v-icon>mdi-skip-previous</v-icon>
    </v-btn>

    <v-btn
      :title="'View next image' | accelerator('Right')"
      icon
      @click="onNextClick"
    >
      <v-icon>mdi-skip-next</v-icon>
    </v-btn>

    <span class="px-3 ellipsis">{{ page }} / {{ maxPage }}</span>

    <v-slider
      v-if="!loading"
      ref="slider"
      v-model="page"
      class="px-3"
      :min="1"
      :max="maxPage"
      hide-details
    />

    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      top
      offset-y
      nudge-top="12"
    >
      <template v-slot:activator="{ on }">
        <v-btn slot="activator" title="Zoom" icon v-on="on">
          <v-icon>mdi-magnify-plus-outline</v-icon>
        </v-btn>
      </template>
      <v-toolbar ref="toolbar" flat dense dark>
        <v-btn
          :title="'Zoom in' | accelerator('CmdOrCtrl+Plus')"
          icon
          @click="onZoomInClick"
        >
          <v-icon>mdi-magnify-plus-outline</v-icon>
        </v-btn>
        <span class="px-3">{{ percentage }}%</span>
        <v-btn
          :title="'Zoom out' | accelerator('CmdOrCtrl+-')"
          icon
          @click="onZoomOutClick"
        >
          <v-icon>mdi-magnify-minus-outline</v-icon>
        </v-btn>
        <v-btn
          :title="'Reset' | accelerator('CmdOrCtrl+0')"
          text
          @click="onResetClick"
        >
          Reset
        </v-btn>
      </v-toolbar>
    </v-menu>

    <v-btn
      :title="fullScreen ? 'Exit fullscreen' : 'Fullscreen'"
      icon
      @click="onFullscreenClick"
    >
      <v-icon>
        {{ fullScreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen' }}
      </v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      hovered: false,
      menu: false,
    }
  },
  computed: {
    page: {
      get() {
        return this.$store.getters['local/viewer/currentFileIndex'] + 1
      },
      set(value) {
        this.$store.dispatch('local/viewer/moveFile', { index: value - 1 })
      },
    },
    maxPage() {
      return this.files.length
    },
    percentage() {
      return Math.floor(this.scale * 100)
    },
    ...mapState(['fullScreen']),
    ...mapState('local/viewer', ['loading', 'files', 'scale']),
  },
  watch: {
    page() {
      this.$refs.slider && this.$refs.slider.$el.querySelector('input').blur()
    },
  },
  methods: {
    onPreviousClick() {
      this.movePreviousFile()
    },
    onNextClick() {
      this.moveNextFile()
    },
    onZoomInClick() {
      this.zoomIn()
    },
    onZoomOutClick() {
      this.zoomOut()
    },
    onResetClick() {
      this.resetZoom()
    },
    onFullscreenClick() {
      this.toggleFullScreen()
    },
    hideMenu() {
      this.menu = false
    },
    isHover() {
      return !!(
        this.$el.querySelector(':hover') ||
        this.$refs.toolbar?.$el.querySelector(':hover')
      )
    },
    ...mapActions('local/viewer', [
      'movePreviousFile',
      'moveNextFile',
      'zoomIn',
      'zoomOut',
      'resetZoom',
      'toggleFullScreen',
    ]),
  },
}
</script>

<style scoped lang="scss">
.viewer-bottom-toolbar ::v-deep .v-input--slider {
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
