<template>
  <v-toolbar class="viewer-top-toolbar" color="transparent" flat dense>
    <v-btn :title="'Close' | accelerator('Esc')" icon @click="onCloseClick">
      <v-icon>mdi-close</v-icon>
    </v-btn>

    <span class="px-3 ellipsis">{{ title }}</span>
  </v-toolbar>
</template>

<script>
import { layoutViewerStore } from '~/store'

export default {
  data() {
    return {
      hovered: false,
    }
  },
  computed: {
    title() {
      if (!layoutViewerStore.currentFile) {
        return ''
      }
      return (
        layoutViewerStore.currentFile.dirname +
        ' - ' +
        layoutViewerStore.currentFile.name
      )
    },
  },
  methods: {
    onCloseClick() {
      layoutViewerStore.dismiss()
    },
    isHover() {
      return !!this.$el.querySelector(':hover')
    },
  },
}
</script>
