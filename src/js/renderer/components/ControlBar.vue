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
      @click="movePrevious"
    >
      <v-icon>skip_previous</v-icon>
    </v-btn>
    <v-btn
      :title="'View next image'|accelerator('Right')"
      flat
      icon
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
        flat
        dense
      >
        <v-btn
          :title="'Zoom in'|accelerator('CmdOrCtrl+Plus')"
          flat
          icon
          @click="zoomIn"
        >
          <v-icon>zoom_in</v-icon>
        </v-btn>
        <span class="px-3">{{ scale }}%</span>
        <v-btn
          :title="'Zoom out'|accelerator('CmdOrCtrl+-')"
          flat
          icon
          @click="zoomOut"
        >
          <v-icon>zoom_out</v-icon>
        </v-btn>
        <v-btn
          :title="'Reset'|accelerator('CmdOrCtrl+0')"
          flat
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
      @click="leaveFullScreen"
    >
      <v-icon>fullscreen_exit</v-icon>
    </v-btn>
    <v-btn
      v-else
      title="Fullscreen"
      flat
      icon
      @click="enterFullScreen"
    >
      <v-icon>fullscreen</v-icon>
    </v-btn>
    <v-btn
      :title="'Close'|accelerator('Esc')"
      flat
      icon
      @click="dismiss"
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
    ...mapState({
      fullScreen: state => state.fullScreen,
      maxPage: state => state.viewer.files.length,
      scale: state => Math.floor(state.viewer.scale * 100)
    })
  },
  methods: {
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
