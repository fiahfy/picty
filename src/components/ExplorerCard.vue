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
        <template slot="item" slot-scope="{ item }">
          <v-list-tile-content>
            <v-list-tile-title v-text="item" />
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn
              small
              color="primary"
              @click.stop="(e) => onItemClick(e, item)"
            >
              delete
            </v-btn>
          </v-list-tile-action>
        </template>
      </v-autocomplete>
    </v-toolbar>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  data() {
    return {
      searchInput: '',
    }
  },
  computed: {
    queryInput: {
      get() {
        return this.$store.state.local.explorer.queryInput
      },
      set(value) {
        this.$store.commit('local/explorer/setQueryInput', {
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
    ...mapState('local/explorer', [
      'selectedFilepath',
      'display',
      'queryHistories',
    ]),
    ...mapGetters('local/explorer', ['canViewFile']),
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
    onTextContextMenu() {
      this.$contextMenu.open([
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
      ])
    },
    onTextAppendIconClick() {
      this.searchFiles({ query: this.searchInput })
    },
    onItemClick(_e, item) {
      this.removeQueryHistory({ queryHistory: item })
    },
    ...mapActions('local/explorer', [
      'searchFiles',
      'viewFile',
      'setDisplay',
      'removeQueryHistory',
    ]),
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
