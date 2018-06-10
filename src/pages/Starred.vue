<template>
  <v-container
    class="starred"
    fill-height
    fluid
    pa-0
  >
    <v-layout column>
      <starred-card />
      <v-container
        fluid
        pa-0
        overflow-hidden
      >
        <starred-table class="fill-height" />
      </v-container>
    </v-layout>
  </v-container>
</template>

<script>
import StarredCard from '~/components/StarredCard'
import StarredTable from '~/components/StarredTable'

export default {
  components: {
    StarredCard,
    StarredTable
  }
}
</script>
