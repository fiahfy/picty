<template>
  <v-container
    fluid
    fill-height
    pa-0
    class="explorer"
  >
    <v-layout column>
      <explorer-menu-bar />
      <v-divider />
      <v-flex fill-height>
        <explorer-list />
      </v-flex>
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

<style scoped lang="scss">
.flex {
  overflow: hidden;
}
</style>
