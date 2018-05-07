<template>
  <v-container
    class="bookmark"
    fluid
    fill-height
    pa-0
  >
    <v-layout column>
      <bookmark-menu-bar />
      <bookmark-list />
    </v-layout>
  </v-container>
</template>

<script>
import BookmarkList from '../components/BookmarkList'
import BookmarkMenuBar from '../components/BookmarkMenuBar'

export default {
  components: {
    BookmarkList,
    BookmarkMenuBar
  }
}
</script>
