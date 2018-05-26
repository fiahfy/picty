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
    <v-snackbar
      v-model="snackbar"
    >
      {{ message }}
      <v-btn
        flat
        @click.native="onCloseClick"
      >Close</v-btn>
    </v-snackbar>
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
import TitleBar from './components/TitleBar'
import Viewer from './components/Viewer'
import * as ContextMenu from './utils/context-menu'

export default {
  components: {
    ActivityBar,
    TitleBar,
    Viewer
  },
  computed: {
    snackbar: {
      get () {
        return this.$store.state.app.snackbar
      },
      set (value) {
        this.$store.commit('app/setSnackbar', { snackbar: value })
      }
    },
    ...mapState({
      message: state => state.app.message,
      viewing: state => state.app.viewing,
      darkTheme: state => state.settings.darkTheme
    }),
    ...mapGetters({
      titleBar: 'app/titleBar'
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
    onCloseClick () {
      this.snackbar = false
    },
    ...mapActions({
      initialize: 'app/initialize',
      open: 'app/open',
      showNextMessage: 'app/showNextMessage'
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
