<template>
  <v-app
    @contextmenu.native="handleContextMenu"
    @drop.native.prevent="handleDrop"
    @dragover.native.prevent
  >
    <title-bar />
    <activity-bar />
    <v-content class="fill-height">
      <router-view class="fill-height" />
    </v-content>
    <notification-bar />
    <viewer-dialog />
  </v-app>
</template>

<script lang="ts">
import {
  defineComponent,
  watchEffect,
  SetupContext,
} from '@vue/composition-api'
import ActivityBar from '~/components/ActivityBar.vue'
import NotificationBar from '~/components/NotificationBar.vue'
import TitleBar from '~/components/TitleBar.vue'
import ViewerDialog from '~/components/ViewerDialog.vue'
import { settingsStore } from '~/store'

export default defineComponent({
  components: {
    ActivityBar,
    NotificationBar,
    TitleBar,
    ViewerDialog,
  },
  setup(_props: {}, context: SetupContext) {
    watchEffect(() => {
      context.root.$vuetify.theme.dark = settingsStore.darkTheme
    })

    const handleContextMenu = () => {
      context.root.$contextMenu.open()
    }
    const handleDrop = (e: DragEvent) => {
      const files = Array.from(e.dataTransfer?.files ?? [])
      if (!files.length) {
        return
      }
      const filepath = files[0].path // eslint-disable-line
      // layoutStore.open({ filepath })
    }

    // layoutStore.initialize()

    return {
      handleContextMenu,
      handleDrop,
    }
  },
})
</script>

<style lang="scss">
@import '~/assets/app.scss';
</style>
