<template>
  <v-toolbar
    class="explorer-toolbar"
    flat
    dense
  >
    <v-text-field
      v-model="directoryInput"
      :prepend-icon-cb="openDirectory"
      name="directory"
      class="mx-3"
      label="Path"
      prepend-icon="folder"
      single-line
      hide-details
      full-width
      @keyup="onKeyUp"
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
        return this.$store.state.app.explorer.directoryInput
      },
      set (value) {
        this.$store.commit('app/explorer/setDirectoryInput', { directoryInput: value })
      }
    }
  },
  methods: {
    onContextMenu (e) {
      ContextMenu.showTextMenu(e)
    },
    onKeyUp (e) {
      if (e.keyCode === 13) {
        this.changeDirectory({ dirpath: e.target.value })
      }
    },
    ...mapActions({
      changeDirectory: 'app/explorer/changeDirectory',
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
