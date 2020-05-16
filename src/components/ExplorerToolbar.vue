<template>
  <v-toolbar class="explorer-toolbar" flat dense>
    <v-btn
      v-long-press="onBackContextMenu"
      :title="'Back' | accelerator('CmdOrCtrl+Left')"
      :disabled="backDisabled"
      icon
      @click="onBackClick"
      @contextmenu.stop="onBackContextMenu"
    >
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <v-btn
      v-long-press="onForwardContextMenu"
      :title="'Forward' | accelerator('CmdOrCtrl+Right')"
      :disabled="forwardDisabled"
      icon
      @click="onForwardClick"
      @contextmenu.stop="onForwardContextMenu"
    >
      <v-icon>mdi-arrow-right</v-icon>
    </v-btn>
    <v-btn
      :title="'Up' | accelerator('CmdOrCtrl+Shift+P')"
      icon
      @click="onUpwardClick"
    >
      <v-icon>mdi-arrow-up</v-icon>
    </v-btn>
    <v-btn title="Reload" icon @click="onRefreshClick">
      <v-icon>mdi-refresh</v-icon>
    </v-btn>
    <v-btn
      :title="'Home' | accelerator('CmdOrCtrl+Shift+H')"
      icon
      @click="onHomeClick"
    >
      <v-icon>mdi-home</v-icon>
    </v-btn>
    <v-btn
      :title="'Bookmark' | accelerator('CmdOrCtrl+D')"
      :color="bookmarkColor"
      icon
      @click="onBookmarkClick"
    >
      <v-icon>mdi-star</v-icon>
    </v-btn>
    <v-text-field
      v-model="directoryInput"
      class="ml-3 pt-0"
      name="directory"
      label="Path"
      prepend-icon="mdi-folder"
      single-line
      hide-details
      @click:prepend="onPrependClick"
      @keyup="onTextKeyUp"
      @contextmenu.stop="onTextContextMenu"
    />
  </v-toolbar>
</template>

<script>
import { layoutExplorerStore } from '~/store'

export default {
  computed: {
    directoryInput: {
      get() {
        return layoutExplorerStore.directoryInput
      },
      set(value) {
        layoutExplorerStore.setDirectoryInput({
          directoryInput: value,
        })
      },
    },
    backDisabled() {
      return !layoutExplorerStore.canBackDirectory
    },
    forwardDisabled() {
      return !layoutExplorerStore.canForwardDirectory
    },
    bookmarkColor() {
      return layoutExplorerStore.directoryBookmarked ? 'primary' : null
    },
  },
  methods: {
    onBackClick() {
      layoutExplorerStore.backDirectory()
    },
    onBackContextMenu() {
      this.$contextMenu.open(
        layoutExplorerStore.backDirectories.map((directory, index) => {
          return {
            label: directory,
            click: () => layoutExplorerStore.backDirectory({ offset: index }),
          }
        })
      )
    },
    onForwardClick() {
      layoutExplorerStore.forwardDirectory()
    },
    onForwardContextMenu() {
      this.$contextMenu.open(
        layoutExplorerStore.forwardDirectories.map((directory, index) => {
          return {
            label: directory,
            click: () =>
              layoutExplorerStore.forwardDirectory({ offset: index }),
          }
        })
      )
    },
    onUpwardClick() {
      layoutExplorerStore.upDirectory()
    },
    onRefreshClick() {
      layoutExplorerStore.reloadDirectory()
    },
    onHomeClick() {
      layoutExplorerStore.changeHomeDirectory()
    },
    onBookmarkClick() {
      layoutExplorerStore.toggleDirectoryBookmarked()
    },
    onTextContextMenu() {
      this.$contextMenu.open([
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
      ])
    },
    onTextKeyUp(e) {
      if (e.keyCode === 13) {
        layoutExplorerStore.changeDirectory({ dirpath: e.target.value })
      }
    },
    onPrependClick() {
      layoutExplorerStore.browseDirectory()
    },
  },
}
</script>
