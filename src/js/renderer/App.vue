<template>
  <v-app
    :dark="darkTheme"
    @contextmenu.native="onContextMenu"
    @drop.native.prevent="onDrop"
    @dragover.native.prevent
  >
    <title-bar v-if="titleBar" />
    <drawer />
    <v-content class="fill-height">
      <router-view />
    </v-content>
    <v-dialog
      v-if="viewing"
      value="true"
      fullscreen
      hide-overlay
    >
      <v-layout
        column
        fill-height
      >
        <title-bar
          v-if="titleBar"
          :app="false"
        />
        <v-container
          card
          fluid
          pa-0
          overflow-hidden
        >
          <viewer class="fill-height" />
        </v-container>
      </v-layout>
    </v-dialog>
  </v-app>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import Drawer from './components/Drawer'
import TitleBar from './components/TitleBar'
import Viewer from './components/Viewer'
import * as ContextMenu from './utils/context-menu'

export default {
  components: {
    Drawer,
    TitleBar,
    Viewer
  },
  computed: {
    ...mapState({
      message: state => state.message,
      viewing: state => state.viewing,
      darkTheme: state => state.settings.darkTheme
    }),
    ...mapGetters({
      titleBar: 'titleBar'
    })
  },
  created () {
    this.initializeExplorer()
    this.initializeBookmark()
  },
  methods: {
    onContextMenu (e) {
      ContextMenu.show(e)
    },
    onDrop (e) {
      const files = Array.from(e.dataTransfer.files)
      if (!files.length) {
        return
      }
      const filepathes = files.map(file => file.path)
      this.open({ filepathes })
    },
    ...mapActions({
      open: 'open',
      initializeExplorer: 'explorer/initialize',
      initializeBookmark: 'bookmark/initialize'
    })
  }
}
</script>

<style lang="scss">
@import '~typeface-roboto/index.css';
@import '~material-design-icons/iconfont/material-icons.css';
@import '~vuetify/dist/vuetify.min.css';

html {
  overflow-y: hidden;
}
</style>
