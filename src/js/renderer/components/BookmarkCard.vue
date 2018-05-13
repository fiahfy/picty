<template>
  <v-card
    class="bookmark-card"
    flat
  >
    <v-card-title class="py-2 px-0">
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
        :disabled="!selectedFilepath"
        flat
        icon
        @click="toggleBookmark({ filepath: selectedFilepath })"
      >
        <v-icon>{{ isBookmarked({ filepath: selectedFilepath}) ? 'star' : 'star_border' }}</v-icon>
      </v-btn>
      <v-btn
        :title="'View'|accelerator('Enter')"
        :disabled="!selectedFilepath"
        flat
        icon
        @click="showViewer({ filepath: selectedFilepath })"
      >
        <v-icon>photo</v-icon>
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
        @keyup="onKeyUp"
        @contextmenu="onContextMenu"
      />
    </v-card-title>
  </v-card>
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
      selectedFilepath: state => state.bookmark.selectedFilepath
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
      ContextMenu.showTextMenu(e)
    },
    onKeyUp (e) {
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
.bookmark-card /deep/ .input-group--text-field label {
  top: 0;
}
</style>
