<template>
  <div class="bookmark">
    <bookmark-menu-bar />
    <divider />
    <div class="container">
      <div
        v-if="message"
        class="message"
      >
        {{ message }}
      </div>
      <bookmark-list />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BookmarkList from '../components/BookmarkList'
import BookmarkMenuBar from '../components/BookmarkMenuBar'

export default {
  components: {
    BookmarkList,
    BookmarkMenuBar
  },
  computed: {
    message () {
      return this.files.length ? '' : 'No Bookmarks'
    },
    ...mapGetters({
      files: 'bookmark/filteredFiles'
    })
  }
}
</script>

<style scoped lang="scss">
.bookmark {
  display: flex;
  flex-direction: column;
  height: 100%;
  .container {
    flex: 1;
    overflow-y: auto;
    position: relative;
    .message {
      align-items: center;
      bottom: 0;
      color: var(--mdc-theme-text-secondary-on-background);
      display: flex;
      justify-content: center;
      left: 0;
      pointer-events: none;
      position: absolute;
      right: 0;
      top: 0;
    }
  }
}
</style>
