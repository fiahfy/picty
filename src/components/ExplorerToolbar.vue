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
import { mapActions, mapGetters } from 'vuex'

export default {
  computed: {
    directoryInput: {
      get() {
        return this.$store.state.local.explorer.directoryInput
      },
      set(value) {
        this.$store.commit('local/explorer/setDirectoryInput', {
          directoryInput: value,
        })
      },
    },
    backDisabled() {
      return !this.canBackDirectory
    },
    forwardDisabled() {
      return !this.canForwardDirectory
    },
    bookmarkColor() {
      return this.directoryBookmarked ? 'primary' : null
    },
    ...mapGetters('local/explorer', [
      'backDirectories',
      'forwardDirectories',
      'canBackDirectory',
      'canForwardDirectory',
      'directoryBookmarked',
    ]),
  },
  methods: {
    onBackClick() {
      this.backDirectory()
    },
    onBackContextMenu() {
      this.$contextMenu.open(
        this.backDirectories.map((directory, index) => {
          return {
            label: directory,
            click: () => this.backDirectory({ offset: index }),
          }
        })
      )
    },
    onForwardClick() {
      this.forwardDirectory()
    },
    onForwardContextMenu() {
      this.$contextMenu.open(
        this.forwardDirectories.map((directory, index) => {
          return {
            label: directory,
            click: () => this.forwardDirectory({ offset: index }),
          }
        })
      )
    },
    onUpwardClick() {
      this.upDirectory()
    },
    onRefreshClick() {
      this.reloadDirectory()
    },
    onHomeClick() {
      this.changeHomeDirectory()
    },
    onBookmarkClick() {
      this.toggleDirectoryBookmarked()
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
        this.changeDirectory({ dirpath: e.target.value })
      }
    },
    onPrependClick() {
      this.browseDirectory()
    },
    ...mapActions('local/explorer', [
      'upDirectory',
      'changeHomeDirectory',
      'changeDirectory',
      'backDirectory',
      'forwardDirectory',
      'reloadDirectory',
      'browseDirectory',
      'toggleDirectoryBookmarked',
    ]),
  },
}
</script>
