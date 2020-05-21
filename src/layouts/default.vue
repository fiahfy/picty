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
    <viewer />
  </v-app>
</template>

<script lang="ts">
import {
  defineComponent,
  watchEffect,
  SetupContext,
  computed,
} from '@vue/composition-api'
import ActivityBar from '~/components/ActivityBar.vue'
import NotificationBar from '~/components/NotificationBar.vue'
import TitleBar from '~/components/TitleBar.vue'
import Viewer from '~/components/Viewer.vue'
import { layoutStore, settingsStore } from '~/store'

export default defineComponent({
  components: {
    ActivityBar,
    NotificationBar,
    TitleBar,
    Viewer,
  },
  setup(_props: {}, context: SetupContext) {
    const viewing = computed(() => layoutStore.viewing)

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
      const filepath = files[0].path
      layoutStore.open({ filepath })
    }

    layoutStore.initialize()

    return {
      viewing,
      handleContextMenu,
      handleDrop,
    }
  },
})
</script>

<style lang="scss">
@import '~/assets/app.scss';
</style>
