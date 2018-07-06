<template>
  <v-container
    class="starred"
    fill-height
    fluid
    pa-0
  >
    <v-layout column>
      <v-progress-linear
        v-if="loading"
        :indeterminate="true"
      />
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
import { mapState } from 'vuex'
import StarredCard from '~/components/StarredCard'
import StarredTable from '~/components/StarredTable'

export default {
  components: {
    StarredCard,
    StarredTable
  },
  computed: {
    ...mapState({
      loading: state => state.starred.loading
    })
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
