<template>
  <v-app
    :dark="darkTheme"
    @contextmenu.native="onContextMenu"
    @drop.native.prevent="onDrop"
    @dragover.native.prevent
  >
    <title-bar v-if="titleBar" />
    <activity-bar />
    <v-content class="fill-height">
      <router-view />
    </v-content>
    <notification-bar />
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
        <v-flex>
          <title-bar
            v-if="titleBar"
            :app="false"
          />
        </v-flex>
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
import ActivityBar from './components/ActivityBar'
import NotificationBar from './components/NotificationBar'
import TitleBar from './components/TitleBar'
import Viewer from './components/Viewer'
import * as ContextMenu from './utils/context-menu'

export default {
  components: {
    ActivityBar,
    NotificationBar,
    TitleBar,
    Viewer
  },
  computed: {
    ...mapState({
      viewing: state => state.viewing,
      darkTheme: state => state.settings.darkTheme
    }),
    ...mapGetters({
      titleBar: 'titleBar'
    })
  },
  watch: {
    snackbar (value) {
      if (value) {
        return
      }
      this.$nextTick(() => {
        this.showNextMessage()
      })
    }
  },
  created () {
    this.initialize()
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
      initialize: 'initialize',
      open: 'open'
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
