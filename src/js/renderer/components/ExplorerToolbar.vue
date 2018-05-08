<template>
  <v-toolbar
    class="explorer-toolbar"
    flat
    dense
  >
    <v-text-field
      v-model="directoryInput"
      :prepend-icon-cb="openDirectory"
      class="mx-3"
      label="Path"
      prepend-icon="folder"
      single-line
      hide-details
      @keyup="onKeyup"
      @contextmenu="onContextMenu"
    />
  </v-toolbar>
</template>

<script>
import { mapActions } from 'vuex'
import * as ContextMenu from '../utils/context-menu'

export default {
  computed: {
    directoryInput: {
      get () {
        return this.$store.state.explorer.directoryInput
      },
      set (value) {
        this.$store.commit('explorer/setDirectoryInput', { directoryInput: value })
      }
    }
  },
  methods: {
    onContextMenu (e) {
      ContextMenu.showTextMenu(e)
    },
    onKeyup (e) {
      if (e.keyCode === 13) {
        this.changeDirectory({ dirpath: e.target.value })
      }
    },
    ...mapActions({
      openDirectory: 'explorer/openDirectory'
    })
  }
}
</script>
