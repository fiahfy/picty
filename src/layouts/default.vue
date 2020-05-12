<template>
  <v-app
    @contextmenu.native="onContextMenu"
    @drop.native.prevent="onDrop"
    @dragover.native.prevent
  >
    <title-bar />
    <activity-bar />
    <v-content class="fill-height">
      <router-view class="fill-height" />
    </v-content>
    <notification-bar />
    <viewer />
  </v-app>
</template>

<script>
import ActivityBar from '~/components/ActivityBar'
import NotificationBar from '~/components/NotificationBar'
import TitleBar from '~/components/TitleBar'
import Viewer from '~/components/Viewer'
import { layoutStore, settingsStore } from '~/store'

export default {
  components: {
    ActivityBar,
    NotificationBar,
    TitleBar,
    Viewer,
  },
  computed: {
    viewing() {
      return layoutStore.viewing
    },
    darkTheme() {
      return settingsStore.darkTheme
    },
  },
  watch: {
    darkTheme(value) {
      this.$vuetify.theme.dark = value
    },
  },
  created() {
    this.$vuetify.theme.dark = this.darkTheme
    layoutStore.initialize()
  },
  methods: {
    onContextMenu() {
      this.$contextMenu.open()
    },
    onDrop(e) {
      const files = Array.from(e.dataTransfer.files)
      if (!files.length) {
        return
      }
      const filepath = files[0].path
      layoutStore.open({ filepath })
    },
  },
}
</script>

<style lang="scss">
@import '~/assets/app.scss';
</style>
