<template>
  <v-card
    class="explorer-card"
    flat
  >
    <v-card-title class="py-2 px-0">
      <v-btn
        :title="'View'|accelerator('Enter')"
        :disabled="photoIconDisabled"
        flat
        icon
        @click="onPhotoIconClick"
      >
        <v-icon>photo</v-icon>
      </v-btn>
      <v-spacer />
      <v-btn
        :color="listIconColor"
        title="List"
        flat
        icon
        @click="onListIconClick"
      >
        <v-icon>view_headline</v-icon>
      </v-btn>
      <v-btn
        :color="thumbnailIconColor"
        title="Thumbnail"
        flat
        icon
        @click="onThumbnailIconClick"
      >
        <v-icon>view_module</v-icon>
      </v-btn>
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
    photoIconDisabled () {
      return !this.selectedFilepath
    },
    listIconColor () {
      return this.display === 'list' ? 'primary' : null
    },
    thumbnailIconColor () {
      return this.display === 'thumbnail' ? 'primary' : null
    },
    ...mapState('local/explorer', [
      'selectedFilepath',
      'display'
    ])
  },
  watch: {
    queryInput (value) {
      this.searchFiles({ query: value })
    }
  },
  methods: {
    onPhotoIconClick () {
      this.viewFile({ filepath: this.selectedFilepath })
    },
    onListIconClick () {
      this.setDisplay({ display: 'list' })
    },
    onThumbnailIconClick () {
      this.setDisplay({ display: 'thumbnail' })
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
      'viewFile',
      'setDisplay'
    ])
  }
}
</script>
