<template>
  <div class="bookmark-menu-bar">
    <div class="row buttons">
      <mdc-button
        class="icon"
        title="Refresh"
        @click="loadFiles"
      >
        <mdc-icon icon="refresh" />
      </mdc-button>

      <divider orientation="vertical" />

      <mdc-button
        class="icon"
        :title="'Bookmark'|accelerator('CmdOrCtrl+D')"
        :disabled="!selectedBookmark"
        @click="toggleBookmark({ filepath: selectedBookmark })"
      >
        <mdc-icon :icon="isBookmarked({ filepath: selectedBookmark}) ? 'star' : 'star_border'" />
      </mdc-button>
      <mdc-button
        class="icon"
        :title="'View'|accelerator('Enter')"
        :disabled="!selectedBookmark"
        @click="showViewer({ filepath: selectedBookmark })"
      >
        <mdc-icon icon="photo" />
      </mdc-button>

      <divider orientation="vertical" />

      <div class="search-wrapper">
        <mdc-icon
          icon="search"
          :title="'Search'|accelerator('CmdOrCtrl+F')"
        />
        <mdc-text-field
          label="Search"
          fullwidth
          class="search"
          @keyup="keyup"
          @contextmenu="contextmenu"
          v-model="searchInput"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import Divider from './Divider'
import MdcButton from './MdcButton'
import MdcIcon from './MdcIcon'
import MdcTextField from './MdcTextField'
import * as ContextMenu from '../utils/context-menu'

export default {
  components: {
    Divider,
    MdcButton,
    MdcIcon,
    MdcTextField
  },
  data () {
    return {
      searchInput: ''
    }
  },
  computed: {
    ...mapState({
      selectedBookmark: state => state.bookmark.selectedBookmark
    }),
    ...mapGetters({
      isBookmarked: 'bookmark/isBookmarked'
    })
  },
  methods: {
    contextmenu (e) {
      ContextMenu.show(e, [
        { label: ContextMenu.Label.Cut },
        { label: ContextMenu.Label.Copy },
        { label: ContextMenu.Label.Paste }
      ])
    },
    keyup (e) {
      if (e.keyCode === 13) {
        this.search({ query: e.target.value })
      }
    },
    ...mapActions({
      loadFiles: 'bookmark/loadFiles',
      search: 'bookmark/search',
      showViewer: 'bookmark/showViewer',
      toggleBookmark: 'bookmark/toggleBookmark'
    })
  },
  watch: {
    searchInput (value) {
      this.search({ query: value })
    }
  }
}
</script>

<style scoped lang="scss">
@import "@material/theme/_color-palette";

.bookmark-menu-bar {
  user-select: none;
  .row {
    display: flex;
    height: 40px;
    &.buttons {
      text-align: left;
      &>* {
        margin: 2px;
      }
      &>.divider {
        margin: 0;
      }
      &>.search-wrapper {
        display: flex;
        flex: 1;
        margin: 0px;
        &>* {
          margin: 4px;
        }
        .mdc-text-field {
          border: none;
          height: 32px;
        }
      }
    }
  }
}
</style>
