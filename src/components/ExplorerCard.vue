<template>
  <v-card
    class="explorer-card"
    flat
  >
    <v-card-title class="py-2 px-0">
      <v-btn
        :title="'View'|accelerator('Enter')"
        :disabled="disabled"
        flat
        icon
        @click="onPhotoClick"
      >
        <v-icon>photo</v-icon>
      </v-btn>
      <v-spacer />
      <v-text-field
        v-model="queryInput"
        name="query"
        class="mx-3 my-2 pt-0"
        label="Search"
        append-icon="search"
        single-line
        hide-details
        clearable
        @keyup="onTextKeyUp"
        @contextmenu.stop="onTextContextMenu"
      />
    </v-card-title>
  </v-card>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import * as ContextMenu from '~/utils/context-menu'

export default {
  computed: {
    queryInput: {
      get () {
        return this.$store.state.local.explorer.queryInput
      },
      set (value) {
        this.$store.commit('local/explorer/setQueryInput', { queryInput: value })
      }
    },
    disabled () {
      return !this.selectedFilepath
    },
    ...mapState('local/explorer', [
      'selectedFilepath'
    ])
  },
  watch: {
    queryInput (value) {
      this.searchFiles({ query: value })
    }
  },
  methods: {
    onPhotoClick () {
      this.viewFile({ filepath: this.selectedFilepath })
    },
    onTextContextMenu (e) {
      ContextMenu.showTextMenu(e)
    },
    onTextKeyUp (e) {
      if (e.keyCode === 13) {
        this.searchFiles({ query: e.target.value })
      }
    },
    ...mapActions('local/explorer', [
      'searchFiles',
      'viewFile'
    ])
  }
}
</script>
