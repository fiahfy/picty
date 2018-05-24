<template>
  <v-toolbar
    class="explorer-toolbar"
    flat
    dense
  >
    <v-btn
      v-long-press="onBackContextMenu"
      :title="'Back'|accelerator('CmdOrCtrl+Left')"
      :disabled="backDisabled"
      flat
      icon
      @click="onBackClick"
      @contextmenu.stop="onBackContextMenu"
    >
      <v-icon>arrow_back</v-icon>
    </v-btn>
    <v-btn
      v-long-press="onForwardContextMenu"
      :title="'Forward'|accelerator('CmdOrCtrl+Right')"
      :disabled="forwardDisabled"
      flat
      icon
      @click="onForwardClick"
      @contextmenu.stop="onForwardContextMenu"
    >
      <v-icon>arrow_forward</v-icon>
    </v-btn>
    <v-btn
      :title="'Up'|accelerator('CmdOrCtrl+Shift+P')"
      flat
      icon
      @click="onUpwardClick"
    >
      <v-icon>arrow_upward</v-icon>
    </v-btn>
    <v-btn
      title="Reload"
      flat
      icon
      @click="onRefreshClick"
    >
      <v-icon>refresh</v-icon>
    </v-btn>
    <v-btn
      :title="'Home'|accelerator('CmdOrCtrl+Shift+H')"
      flat
      icon
      @click="onHomeClick"
    >
      <v-icon>home</v-icon>
    </v-btn>
    <v-text-field
      v-model="directoryInput"
      :prepend-icon-cb="prependIconCallback"
      name="directory"
      class="mx-3"
      label="Path"
      prepend-icon="folder"
      single-line
      hide-details
      full-width
      @keyup="onTextKeyUp"
      @contextmenu.stop="onTextContextMenu"
    />
  </v-toolbar>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import * as ContextMenu from '~/utils/context-menu'

export default {
  computed: {
    directoryInput: {
      get () {
        return this.$store.state.app.explorer.directoryInput
      },
      set (value) {
        this.$store.commit('app/explorer/setDirectoryInput', { directoryInput: value })
      }
    },
    backDisabled () {
      return !this.canBackDirectory
    },
    forwardDisabled () {
      return !this.canForwardDirectory
    },
    ...mapGetters({
      backDirectories: 'app/explorer/backDirectories',
      forwardDirectories: 'app/explorer/forwardDirectories',
      canBackDirectory: 'app/explorer/canBackDirectory',
      canForwardDirectory: 'app/explorer/canForwardDirectory'
    })
  },
  methods: {
    onBackClick () {
      this.backDirectory()
    },
    onBackContextMenu (e) {
      ContextMenu.show(e, this.backDirectories.map((directory, index) => {
        return {
          label: directory,
          click: () => {
            this.backDirectory({ offset: index })
          }
        }
      }))
    },
    onForwardClick () {
      this.forwardDirectory()
    },
    onForwardContextMenu (e) {
      ContextMenu.show(e, this.forwardDirectories.map((directory, index) => {
        return {
          label: directory,
          click: () => {
            this.forwardDirectory({ offset: index })
          }
        }
      }))
    },
    onUpwardClick () {
      this.upDirectory()
    },
    onRefreshClick () {
      this.reloadDirectory()
    },
    onHomeClick () {
      this.changeHomeDirectory()
    },
    onTextContextMenu (e) {
      ContextMenu.showTextMenu(e)
    },
    onTextKeyUp (e) {
      if (e.keyCode === 13) {
        this.changeDirectory({ dirpath: e.target.value })
      }
    },
    prependIconCallback () {
      this.openDirectory()
    },
    ...mapActions({
      upDirectory: 'app/explorer/upDirectory',
      changeHomeDirectory: 'app/explorer/changeHomeDirectory',
      changeDirectory: 'app/explorer/changeDirectory',
      backDirectory: 'app/explorer/backDirectory',
      forwardDirectory: 'app/explorer/forwardDirectory',
      reloadDirectory: 'app/explorer/reloadDirectory',
      openDirectory: 'app/explorer/openDirectory'
    })
  }
}
</script>

<style scoped lang="scss">
.explorer-toolbar /deep/ .input-group--text-field label {
  margin-left: 0;
}
</style>
