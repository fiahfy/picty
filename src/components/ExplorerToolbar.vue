<template>
  <v-toolbar class="explorer-toolbar" flat dense>
    <v-btn
      v-long-press="handleContextMenuBack"
      :title="'Back' | accelerator('CmdOrCtrl+Left')"
      :disabled="!canBack"
      icon
      @click="handleClickBack"
      @contextmenu.stop="handleContextMenuBack"
    >
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <v-btn
      v-long-press="handleContextMenuForward"
      :title="'Forward' | accelerator('CmdOrCtrl+Right')"
      :disabled="!canForward"
      icon
      @click="handleClickForward"
      @contextmenu.stop="handleContextMenuForward"
    >
      <v-icon>mdi-arrow-right</v-icon>
    </v-btn>
    <v-btn
      :title="'Up' | accelerator('CmdOrCtrl+Shift+P')"
      icon
      @click="handleClickUpward"
    >
      <v-icon>mdi-arrow-up</v-icon>
    </v-btn>
    <v-btn title="Reload" icon @click="handleClickReload">
      <v-icon>mdi-refresh</v-icon>
    </v-btn>
    <v-btn
      :title="'Home' | accelerator('CmdOrCtrl+Shift+H')"
      icon
      @click="handleClickHome"
    >
      <v-icon>mdi-home</v-icon>
    </v-btn>
    <v-text-field
      v-model="state.location"
      class="ml-3"
      name="location"
      label="Path"
      prepend-inner-icon="mdi-folder"
      dense
      filled
      rounded
      single-line
      hide-details
      @click:prepend-inner="handleClickFolder"
      @keyup.enter="handleKeyUpEnter"
      @contextmenu.stop="handleContextMenuLocation"
    />
  </v-toolbar>
</template>

<script lang="ts">
import { shell } from 'electron'
import {
  defineComponent,
  computed,
  reactive,
  watch,
  SetupContext,
} from '@vue/composition-api'
import { explorerStore, historyStore } from '~/store'

export default defineComponent({
  setup(_props: {}, context: SetupContext) {
    const state = reactive({ location: explorerStore.location })

    const canBack = computed(() => historyStore.canBack)
    const canForward = computed(() => historyStore.canForward)

    const handleClickBack = () => {
      context.emit('click-back')
    }
    const handleClickForward = () => {
      context.emit('click-forward')
    }
    const handleClickUpward = () => {
      context.emit('click-upward')
    }
    const handleClickReload = () => {
      context.emit('click-reload')
    }
    const handleClickHome = () => {
      context.emit('click-home')
    }
    const handleClickFolder = () => {
      shell.openItem(explorerStore.location)
    }
    const handleKeyUpEnter = () => {}
    const handleContextMenuLocation = () => {}
    const handleContextMenuBack = () => {}
    const handleContextMenuForward = () => {}

    watch(
      () => explorerStore.location,
      (location) => {
        state.location = location
      }
    )

    return {
      state,
      canBack,
      canForward,
      handleClickBack,
      handleClickForward,
      handleClickUpward,
      handleClickReload,
      handleClickHome,
      handleClickFolder,
      handleKeyUpEnter,
      handleContextMenuLocation,
      handleContextMenuBack,
      handleContextMenuForward,
    }
  },
})
</script>
