<template>
  <v-container
    class="explorer"
    fluid
    fill-height
    pa-0
  >
    <v-layout column>
      <explorer-menu-bar />
      <v-divider />
      <explorer-list />
    </v-layout>
  </v-container>
</template>

<script>
import ExplorerList from '../components/ExplorerList'
import ExplorerMenuBar from '../components/ExplorerMenuBar'

export default {
  components: {
    ExplorerList,
    ExplorerMenuBar
  }
}
</script>
