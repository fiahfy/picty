<template>
  <v-card class="explorer-card" flat tile>
    <v-toolbar color="transparent" flat dense>
      <v-btn
        :title="'View' | accelerator('Enter')"
        :disabled="!canViewFile"
        flat
        icon
        @click="onViewClick"
      >
        <v-icon>photo</v-icon>
      </v-btn>
      <v-spacer />
      <v-btn :color="listColor" title="List" flat icon @click="onListClick">
        <v-icon>view_headline</v-icon>
      </v-btn>
      <v-btn
        :color="thumbnailColor"
        title="Thumbnail"
        flat
        icon
        @click="onThumbnailClick"
      >
        <v-icon>view_module</v-icon>
      </v-btn>
      <v-autocomplete
        v-model="queryInput"
        class="ml-3 pt-0"
        :items="queryHistories.slice().reverse()"
        name="query"
        label="Search"
        prepend-icon="search"
        single-line
        hide-details
        clearable
        @input="onTextInput"
        @keyup="onTextKeyUp"
        @contextmenu.stop="onTextContextMenu"
      />
    </v-toolbar>
  </v-card>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import * as ContextMenu from '~/utils/context-menu'

export default {
  computed: {
    queryInput: {
      get() {
        return this.$store.state.local.explorer.queryInput
      },
      set(value) {
        this.$store.commit('local/explorer/setQueryInput', {
          queryInput: value
        })
      }
    },
    listColor() {
      return this.display === 'list' ? 'primary' : null
    },
    thumbnailColor() {
      return this.display === 'thumbnail' ? 'primary' : null
    },
    ...mapState('local/explorer', [
      'selectedFilepath',
      'display',
      'queryHistories'
    ]),
    ...mapGetters('local/explorer', ['canViewFile'])
  },
  methods: {
    onViewClick() {
      this.viewFile({ filepath: this.selectedFilepath })
    },
    onListClick() {
      this.setDisplay({ display: 'list' })
    },
    onThumbnailClick() {
      this.setDisplay({ display: 'thumbnail' })
    },
    onTextInput(value) {
      this.searchFiles({ query: value })
    },
    onTextKeyUp(e) {
      if (e.keyCode === 13) {
        this.searchFiles({ query: e.target.value })
      }
    },
    onTextContextMenu(e) {
      ContextMenu.showTextMenu(e)
    },
    ...mapActions('local/explorer', ['searchFiles', 'viewFile', 'setDisplay'])
  }
}
</script>
