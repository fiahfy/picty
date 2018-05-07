<template>
  <v-toolbar
    class="bookmark-menu-bar"
    flat
    dense
  >
    <v-btn
      title="Refresh"
      flat
      icon
      @click="load"
    >
      <v-icon>refresh</v-icon>
    </v-btn>
    <v-btn
      :title="'Bookmark'|accelerator('CmdOrCtrl+D')"
      :disabled="!selectedBookmark"
      flat
      icon
      @click="toggleBookmark({ filepath: selectedBookmark })"
    >
      <v-icon>{{ isBookmarked({ filepath: selectedBookmark}) ? 'star' : 'star_border' }}</v-icon>
    </v-btn>
    <v-btn
      :title="'View'|accelerator('Enter')"
      :disabled="!selectedBookmark"
      flat
      icon
      @click="showViewer({ filepath: selectedBookmark })"
    >
      <v-icon>photo</v-icon>
    </v-btn>
    <v-icon
      :title="'Search'|accelerator('CmdOrCtrl+F')"
      class="ma-2 pa-1"
    >search</v-icon>
    <v-text-field
      v-model="queryInput"
      label="Search"
      single-line
      full-width
      hide-details
      clearable
      @keyup="onQueryKeyup"
      @contextmenu="onContextMenu"
    />
  </v-toolbar>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import * as ContextMenu from '../utils/context-menu'

export default {
  computed: {
    queryInput: {
      get () {
        return this.$store.state.bookmark.queryInput
      },
      set (value) {
        this.$store.commit('bookmark/setQueryInput', { queryInput: value })
      }
    },
    ...mapState({
      selectedBookmark: state => state.bookmark.selectedBookmark
    }),
    ...mapGetters({
      isBookmarked: 'bookmark/isBookmarked'
    })
  },
  watch: {
    queryInput () {
      this.search()
    }
  },
  methods: {
    onContextMenu (e) {
      ContextMenu.show(e, [
        { role: ContextMenu.Role.cut },
        { role: ContextMenu.Role.copy },
        { role: ContextMenu.Role.paste }
      ])
    },
    onQueryKeyup (e) {
      if (e.keyCode === 13) {
        this.search({ query: e.target.value })
      }
    },
    ...mapActions({
      load: 'bookmark/load',
      search: 'bookmark/search',
      showViewer: 'bookmark/showViewer',
      toggleBookmark: 'bookmark/toggleBookmark'
    })
  }
}
</script>

<style scoped lang="scss">
.bookmark-menu-bar /deep/ .input-group>label {
  margin-left: 0;
}
</style>
