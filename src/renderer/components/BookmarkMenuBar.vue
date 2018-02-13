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
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import Divider from './Divider'
import MdcButton from './MdcButton'
import MdcIcon from './MdcIcon'

export default {
  components: {
    Divider,
    MdcButton,
    MdcIcon
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
    ...mapActions({
      loadFiles: 'bookmark/loadFiles',
      showViewer: 'bookmark/showViewer',
      toggleBookmark: 'bookmark/toggleBookmark'
    })
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
    }
  }
}
</style>
