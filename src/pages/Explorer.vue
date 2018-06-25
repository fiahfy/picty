<template>
  <v-container
    class="explorer"
    fill-height
    fluid
    pa-0
  >
    <v-layout column>
      <v-progress-linear
        v-if="loading"
        :indeterminate="true"
      />
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
import { mapState } from 'vuex'
import ExplorerToolbar from '~/components/ExplorerToolbar'
import ExplorerCard from '~/components/ExplorerCard'
import ExplorerTable from '~/components/ExplorerTable'

export default {
  components: {
    ExplorerToolbar,
    ExplorerCard,
    ExplorerTable
  },
  computed: {
    ...mapState({
      loading: state => state.explorer.loading
    })
  }
}
</script>

<style scoped lang="scss">
.layout {
  position: relative;
  .progress-linear {
    left: 0;
    margin: 0;
    position: absolute;
    right: 0;
    top: 0;
  }
}
</style>
