<template>
  <v-card
    class="explorer-card"
    flat
  >
    <v-card-title class="py-2 px-0">
      <v-btn
        :title="'Star'|accelerator('CmdOrCtrl+D')"
        :disabled="disabled"
        flat
        icon
        @click="onStarClick"
      >
        <v-icon>{{ starIcon }}</v-icon>
      </v-btn>
      <v-btn
        :title="'View'|accelerator('Enter')"
        :disabled="disabled"
        flat
        icon
        @click="onPhotoClick"
      >
        <v-icon>photo</v-icon>
      </v-btn>
      <v-spacer />
      <v-text-field
        v-model="queryInput"
        name="query"
        class="mx-3 my-2 pt-0"
        label="Search"
        append-icon="search"
        single-line
        hide-details
        clearable
        @keyup="onTextKeyUp"
        @contextmenu.stop="onTextContextMenu"
      />
    </v-card-title>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import * as ContextMenu from '~/utils/context-menu'

export default {
  computed: {
    queryInput: {
      get () {
        return this.$store.state.explorer.queryInput
      },
      set (value) {
        this.$store.commit('explorer/setQueryInput', { queryInput: value })
      }
    },
    disabled () {
      return !this.filepath
    },
    starIcon () {
      return this.isStarred({ filepath: this.filepath }) ? 'star' : 'star_border'
    },
    ...mapState({
      filepath: state => state.explorer.filepath
    }),
    ...mapGetters({
      isStarred: 'explorer/isStarred'
    })
  },
  watch: {
    queryInput () {
      this.search()
    }
  },
  methods: {
    onStarClick () {
      this.toggleStarred({ filepath: this.filepath })
    },
    onPhotoClick () {
      this.showViewer({ filepath: this.filepath })
    },
    onTextContextMenu (e) {
      ContextMenu.showTextMenu(e)
    },
    onTextKeyUp (e) {
      if (e.keyCode === 13) {
        this.search()
      }
    },
    ...mapActions({
      search: 'explorer/search',
      showViewer: 'explorer/showViewer',
      toggleStarred: 'explorer/toggleStarred'
    })
  }
}
</script>

<style scoped lang="scss">
.explorer-card /deep/ .input-group--text-field label {
  top: 0;
}
</style>
