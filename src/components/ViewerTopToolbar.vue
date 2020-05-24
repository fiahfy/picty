<template>
  <v-toolbar class="viewer-top-toolbar" color="transparent" flat dense>
    <v-btn :title="'Close' | accelerator('Esc')" icon @click="handleClickClose">
      <v-icon>mdi-close</v-icon>
    </v-btn>

    <span class="px-3 ellipsis">{{ title }}</span>
  </v-toolbar>
</template>

<script lang="ts">
import { defineComponent, SetupContext } from '@vue/composition-api'

export default defineComponent({
  setup(_props: {}, context: SetupContext) {
    const isHover = () => {
      return !!context.root.$el.querySelector(':hover')
    }
    const handleClickClose = () => {
      context.emit('click-close')
    }

    return {
      title: '',
      isHover,
      handleClickClose,
    }
  },
  // computed: {
  //   title() {
  //     if (!layoutViewerStore.currentFile) {
  //       return ''
  //     }
  //     return (
  //       layoutViewerStore.currentFile.dirname +
  //       ' - ' +
  //       layoutViewerStore.currentFile.name
  //     )
  //   },
  // },
})
</script>
