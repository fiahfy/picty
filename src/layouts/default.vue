<template>
  <v-app
    @contextmenu.native="handleContextMenu"
    @drop.native.prevent="handleDrop"
    @dragover.native.prevent
  >
    <title-bar />
    <sidebar />
    <v-content class="fill-height">
      <router-view class="fill-height" />
    </v-content>
    <settings-dialog />
    <viewer-dialog />
  </v-app>
</template>

<script lang="ts">
import {
  defineComponent,
  watchEffect,
  SetupContext,
} from '@vue/composition-api'
import Sidebar from '~/components/Sidebar.vue'
import TitleBar from '~/components/TitleBar.vue'
import SettingsDialog from '~/components/SettingsDialog.vue'
import ViewerDialog from '~/components/ViewerDialog.vue'
import { settingsStore } from '~/store'

export default defineComponent({
  components: {
    Sidebar,
    TitleBar,
    SettingsDialog,
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
      const filePath = files[0].path // eslint-disable-line
      // layoutStore.open({ filePath })
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
