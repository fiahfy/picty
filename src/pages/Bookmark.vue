<template>
  <v-container
    class="bookmark"
    fill-height
    fluid
    pa-0
  >
    <v-layout column>
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
import BookmarkTable from '~/components/BookmarkTable'

export default {
  components: {
    BookmarkTable
  }
}
</script>
