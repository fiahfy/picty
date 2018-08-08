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
        <explorer-table
          v-if="display === 'list'"
          class="fill-height"
        />
        <explorer-grid-list
          v-else
          class="fill-height"
        />
      </v-container>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import ExplorerToolbar from '~/components/ExplorerToolbar'
import ExplorerCard from '~/components/ExplorerCard'
import ExplorerTable from '~/components/ExplorerTable'
import ExplorerGridList from '~/components/ExplorerGridList'

export default {
  components: {
    ExplorerToolbar,
    ExplorerCard,
    ExplorerTable,
    ExplorerGridList
  },
  computed: {
    ...mapState('local/explorer', [
      'display'
    ])
  }
}
</script>

<style scoped lang="scss">
.layout {
  position: relative;
  .v-progress-linear {
    left: 0;
    margin: 0;
    position: absolute;
    right: 0;
    top: 0;
  }
}
</style>
