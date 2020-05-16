<template>
  <v-card class="explorer-card" flat tile>
    <v-toolbar color="transparent" flat dense>
      <v-btn
        :title="'View' | accelerator('Enter')"
        :disabled="!canViewFile"
        icon
        @click="onViewClick"
      >
        <v-icon>mdi-image</v-icon>
      </v-btn>
      <v-spacer />
      <v-btn :color="listColor" title="List" icon @click="onListClick">
        <v-icon>mdi-view-headline</v-icon>
      </v-btn>
      <v-btn
        :color="thumbnailColor"
        title="Thumbnail"
        icon
        @click="onThumbnailClick"
      >
        <v-icon>mdi-view-module</v-icon>
      </v-btn>
      <v-autocomplete
        ref="autocomplete"
        v-model="queryInput"
        :search-input.sync="searchInput"
        class="ml-3 pt-0"
        :items="queryHistories.slice().reverse()"
        name="query"
        label="Search"
        append-outer-icon="mdi-magnify"
        single-line
        hide-details
        clearable
        @input="onTextInput"
        @keyup="onTextKeyUp"
        @contextmenu.stop="onTextContextMenu"
        @click:append-outer="onTextAppendIconClick"
      >
        <template v-slot:item="{ item }">
          <v-list-item-content>
            <v-list-item-title v-text="item" />
          </v-list-item-content>
          <v-list-item-action>
            <v-btn
              small
              text
              color="primary"
              @click.stop="(e) => onItemClick(e, item)"
            >
              delete
            </v-btn>
          </v-list-item-action>
        </template>
      </v-autocomplete>
    </v-toolbar>
  </v-card>
</template>

<script>
import { layoutExplorerStore } from '~/store'

export default {
  data() {
    return {
      searchInput: '',
    }
  },
  computed: {
    queryInput: {
      get() {
        return layoutExplorerStore.queryInput
      },
      set(value) {
        layoutExplorerStore.setQueryInput({
          queryInput: value,
        })
      },
    },
    listColor() {
      return this.display === 'list' ? 'primary' : null
    },
    thumbnailColor() {
      return this.display === 'thumbnail' ? 'primary' : null
    },
    selectedFilepath() {
      return layoutExplorerStore.selectedFilepath
    },
    display() {
      return layoutExplorerStore.display
    },
    queryHistories() {
      return layoutExplorerStore.queryHistories
    },
    canViewFile() {
      return layoutExplorerStore.canViewFile
    },
  },
  methods: {
    onViewClick() {
      layoutExplorerStore.viewFile({ filepath: this.selectedFilepath })
    },
    onListClick() {
      layoutExplorerStore.setDisplay({ display: 'list' })
    },
    onThumbnailClick() {
      layoutExplorerStore.setDisplay({ display: 'thumbnail' })
    },
    onTextInput(value) {
      layoutExplorerStore.searchFiles({ query: value })
    },
    onTextKeyUp(e) {
      if (e.keyCode === 13) {
        layoutExplorerStore.searchFiles({ query: e.target.value })
      }
    },
    onTextContextMenu() {
      this.$contextMenu.open([
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
      ])
    },
    onTextAppendIconClick() {
      layoutExplorerStore.searchFiles({ query: this.searchInput })
    },
    onItemClick(_e, item) {
      layoutExplorerStore.removeQueryHistory({ queryHistory: item })
    },
  },
}
</script>

<style scope lang="scss">
.v-autocomplete__content {
  width: 0;
  .v-list__tile__action {
    min-width: unset;
  }
}
</style>
