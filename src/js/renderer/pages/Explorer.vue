<template>
  <v-container
    class="explorer"
    fluid
    fill-height
    pa-0
  >
    <v-layout column>
      <explorer-menu-bar />
      <explorer-card />
      <explorer-table />
    </v-layout>
  </v-container>
</template>

<script>
import ExplorerMenuBar from '../components/ExplorerMenuBar'
import ExplorerCard from '../components/ExplorerCard'
import ExplorerTable from '../components/ExplorerTable'

export default {
  components: {
    ExplorerMenuBar,
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
