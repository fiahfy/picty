<template>
  <v-app
    @contextmenu.native="handleContextMenu"
    @drop.native.prevent="handleDrop"
    @dragover.native.prevent
  >
    <title-bar />
    <sidebar />
    <v-main class="fill-height">
      <router-view class="fill-height" />
    </v-main>
    <settings-dialog />
    <presentation-dialog />
  </v-app>
</template>

<script lang="ts">
import { defineComponent, watch, SetupContext } from '@vue/composition-api'
import PresentationDialog from '~/components/PresentationDialog.vue'
import SettingsDialog from '~/components/SettingsDialog.vue'
import Sidebar from '~/components/Sidebar.vue'
import TitleBar from '~/components/TitleBar.vue'
import { settingsStore } from '~/store'

export default defineComponent({
  components: {
    PresentationDialog,
    SettingsDialog,
    Sidebar,
    TitleBar,
  },
  setup(_props: {}, context: SetupContext) {
    const handleContextMenu = () => {
      context.root.$contextMenu.open()
    }
    const handleDrop = (e: DragEvent) => {
      const files = Array.from(e.dataTransfer?.files ?? [])
      const filePath = files[0].path
      if (filePath) {
        context.root.$eventBus.$emit('change-location', filePath)
      }
    }

    watch(
      () => settingsStore.darkTheme,
      (darkTheme) => {
        context.root.$vuetify.theme.dark = darkTheme
      }
    )

    return {
      handleContextMenu,
      handleDrop,
    }
  },
})
</script>
