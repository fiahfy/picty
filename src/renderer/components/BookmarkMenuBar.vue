<template>
  <div class="bookmark-menu-bar">
    <div class="row buttons">
      <mdc-button
        title="Refresh"
        @click="load"
      >
        <mdc-icon
          slot="icon"
          icon="refresh"
        />
      </mdc-button>

      <divider orientation="vertical" />

      <mdc-button
        :title="'Bookmark'|accelerator('CmdOrCtrl+D')"
        :disabled="!selectedBookmark"
        @click="toggleBookmark({ filepath: selectedBookmark })"
      >
        <mdc-icon
          slot="icon"
          :icon="isBookmarked({ filepath: selectedBookmark}) ? 'star' : 'star_border'"
        />
      </mdc-button>
      <mdc-button
        :title="'View'|accelerator('Enter')"
        :disabled="!selectedBookmark"
        @click="showViewer({ filepath: selectedBookmark })"
      >
        <mdc-icon
          slot="icon"
          icon="photo"
        />
      </mdc-button>

      <divider orientation="vertical" />

      <div class="search-wrapper">
        <mdc-icon
          :title="'Search'|accelerator('CmdOrCtrl+F')"
          icon="search"
        />
        <mdc-text-field
          v-model="searchInput"
          fullwidth
          label="Search"
          class="search"
          @keyup="keyup"
          @contextmenu="contextmenu"
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
  watch: {
    searchInput (value) {
      this.search({ query: value })
    }
  },
  methods: {
    contextmenu (e) {
      ContextMenu.show(e, [
        { role: ContextMenu.Role.cut },
        { role: ContextMenu.Role.copy },
        { role: ContextMenu.Role.paste }
      ])
    },
    keyup (e) {
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
      .divider {
        margin: 0;
      }
      .search-wrapper {
        display: flex;
        flex: 1;
        margin: 0px;
        &>* {
          margin: 4px;
        }
        .mdc-icon {
          color: var(--mdc-theme-text-icon-on-background);
        }
        .mdc-text-field {
          border: none;
          height: 32px;
        }
        &:not(.mdc-text-field--disabled) /deep/ .mdc-text-field__input::placeholder {
          color: var(--mdc-theme-text-hint-on-background);
        }
      }
      .mdc-button {
        min-width: 36px;
        padding: 0;
        .mdc-icon {
          font-size: 24px;
          height: auto;
          margin: 0;
          padding: 0;
          width: auto;
        }
      }
      .mdc-icon {
        padding: 4px;
      }
    }
  }
}
</style>
