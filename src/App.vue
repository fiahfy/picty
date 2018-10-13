<template>
  <v-app
    :dark="settings.darkTheme"
    @contextmenu.native="onContextMenu"
    @drop.native.prevent="onDrop"
    @dragover.native.prevent
  >
    <title-bar />
    <activity-bar />
    <v-content class="fill-height">
      <router-view />
    </v-content>
    <notification-bar />
    <viewer />
  </v-app>
</template>

<script>
import { mapActions, mapState } from 'vuex'
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
    ...mapState(['viewing', 'settings'])
  },
  created() {
    this.initialize()
  },
  methods: {
    onContextMenu(e) {
      ContextMenu.show(e)
    },
    onDrop(e) {
      const files = Array.from(e.dataTransfer.files)
      if (!files.length) {
        return
      }
      const filepathes = files.map((file) => file.path)
      this.open({ filepathes })
    },
    ...mapActions(['initialize', 'open'])
  }
}
</script>

<style lang="scss">
@import '~typeface-roboto/index.css';
@import '~material-design-icons-iconfont/dist/material-design-icons.css';
@import '~vuetify/dist/vuetify.min.css';

html {
  overflow-y: hidden;
}

.no-transition {
  &-leave-active,
  &-enter-active {
    transition: none;
  }
}
</style>
