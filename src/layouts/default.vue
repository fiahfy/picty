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
import { defineComponent, watch, SetupContext } from 'nuxt-composition-api'
import { settingsStore } from '~/store'

export default defineComponent({
  setup(_props: unknown, context: SetupContext) {
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

    context.root.$vuetify.theme.dark = settingsStore.darkTheme

    return {
      handleContextMenu,
      handleDrop,
    }
  },
})
</script>
