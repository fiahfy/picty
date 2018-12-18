<template>
  <v-app
    :dark="darkTheme"
    @contextmenu.native="onContextMenu"
    @drop.native.prevent="onDrop"
    @dragover.native.prevent
  >
    <title-bar />
    <activity-bar />
    <v-content class="fill-height"><nuxt /></v-content>
    <notification-bar />
    <viewer />
  </v-app>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import ActivityBar from '~/components/ActivityBar'
import NotificationBar from '~/components/NotificationBar'
import TitleBar from '~/components/TitleBar'
import Viewer from '~/components/Viewer'

export default {
  components: {
    ActivityBar,
    NotificationBar,
    TitleBar,
    Viewer
  },
  computed: {
    ...mapState(['viewing']),
    ...mapState('settings', ['darkTheme'])
  },
  created() {
    this.initialize()
  },
  methods: {
    onContextMenu() {
      this.$contextMenu.show()
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
