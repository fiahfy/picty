<template>
  <v-container
    class="explorer"
    fluid
    fill-height
    pa-0
  >
    <v-layout column>
      <explorer-toolbar />
      <explorer-card />
      <explorer-table />
    </v-layout>
  </v-container>
</template>

<script>
import ExplorerToolbar from '../components/ExplorerToolbar'
import ExplorerCard from '../components/ExplorerCard'
import ExplorerTable from '../components/ExplorerTable'

export default {
  components: {
    ExplorerToolbar,
    ExplorerCard,
    ExplorerTable
  }
}
</script>

<style scoped lang="scss">
.explorer-table {
  flex: 1;
  overflow: hidden;
}
</style>
