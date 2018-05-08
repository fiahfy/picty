<template>
  <v-container
    class="bookmark"
    fluid
    fill-height
    pa-0
  >
    <v-layout column>
      <bookmark-card />
      <bookmark-table />
    </v-layout>
  </v-container>
</template>

<script>
import BookmarkCard from '../components/BookmarkCard'
import BookmarkTable from '../components/BookmarkTable'

export default {
  components: {
    BookmarkCard,
    BookmarkTable
  }
}
</script>

<style scoped lang="scss">
.bookmark-table {
  flex: 1;
  overflow: hidden;
}
</style>
