<template>
  <v-container
    class="explorer"
    fill-height
    fluid
    pa-0
  >
    <v-layout column>
      <explorer-toolbar />
      <explorer-card />
      <v-container
        fluid
        pa-0
        overflow-hidden
      >
        <explorer-table class="fill-height" />
      </v-container>
    </v-layout>
  </v-container>
</template>

<script>
import ExplorerToolbar from '~/components/ExplorerToolbar'
import ExplorerCard from '~/components/ExplorerCard'
import ExplorerTable from '~/components/ExplorerTable'

export default {
  components: {
    ExplorerToolbar,
    ExplorerCard,
    ExplorerTable
  }
}
</script>
