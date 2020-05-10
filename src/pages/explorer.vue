<template>
  <v-container class="explorer" fill-height fluid pa-0>
    <v-layout column>
      <explorer-toolbar class="flex-grow-0" />
      <explorer-card class="flex-grow-0" />
      <v-container fluid pa-0 overflow-hidden flex-grow-1>
        <component :is="component" class="fill-height" />
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
  },
  computed: {
    component() {
      return this.display === 'list' ? ExplorerTable : ExplorerGridList
    },
    ...mapState('local/explorer', ['display']),
  },
}
</script>
