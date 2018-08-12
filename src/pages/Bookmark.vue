<template>
  <v-container
    class="bookmark"
    fill-height
    fluid
    pa-0
  >
    <v-layout column>
      <bookmark-card />
      <v-container
        fluid
        pa-0
        overflow-hidden
      >
        <bookmark-table
          class="fill-height"
        />
      </v-container>
    </v-layout>
  </v-container>
</template>

<script>
import BookmarkCard from '~/components/BookmarkCard'
import BookmarkTable from '~/components/BookmarkTable'

export default {
  components: {
    BookmarkCard,
    BookmarkTable
  }
}
</script>
