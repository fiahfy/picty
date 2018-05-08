<template>
  <v-card flat>
    <v-card-title>
      <v-spacer />
      <v-text-field
        v-model="queryInput"
        label="Search"
        append-icon="search"
        single-line
        hide-details
        clearable
        @keyup="onQueryKeyup"
        @contextmenu="onContextMenu"
      />
    </v-card-title>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'
import * as ContextMenu from '../utils/context-menu'

export default {
  computed: {
    queryInput: {
      get () {
        return this.$store.state.explorer.queryInput
      },
      set (value) {
        this.$store.commit('explorer/setQueryInput', { queryInput: value })
      }
    }
  },
  watch: {
    queryInput () {
      this.search()
    }
  },
  methods: {
    onContextMenu (e) {
      ContextMenu.showTextMenu(e)
    },
    onQueryKeyup (e) {
      if (e.keyCode === 13) {
        this.search({ query: e.target.value })
      }
    },
    ...mapActions({
      search: 'explorer/search'
    })
  }
}
</script>
