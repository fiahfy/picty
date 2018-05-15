<template>
  <v-card
    class="explorer-card"
    flat
  >
    <v-card-title class="py-2 px-0">
      <v-btn
        v-long-press="showBackMenu"
        ref="backButton"
        :title="'Back directory'|accelerator('CmdOrCtrl+Left')"
        :disabled="!canBackDirectory"
        flat
        icon
        @click="backDirectory"
        @contextmenu="showBackMenu"
      >
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-btn
        v-long-press="showForwardMenu"
        ref="forwardButton"
        :title="'Forward directory'|accelerator('CmdOrCtrl+Right')"
        :disabled="!canForwardDirectory"
        flat
        icon
        @click="forwardDirectory"
        @contextmenu="showForwardMenu"
      >
        <v-icon>arrow_forward</v-icon>
      </v-btn>
      <v-btn
        :title="'Change parent directory'|accelerator('CmdOrCtrl+Shift+P')"
        flat
        icon
        @click="changeParentDirectory"
      >
        <v-icon>arrow_upward</v-icon>
      </v-btn>
      <v-btn
        :title="'Change home directory'|accelerator('CmdOrCtrl+Shift+H')"
        flat
        icon
        @click="changeHomeDirectory"
      >
        <v-icon>home</v-icon>
      </v-btn>
      <v-btn
        :title="'Star'|accelerator('CmdOrCtrl+D')"
        :disabled="!filepath"
        flat
        icon
        @click="toggleBookmark({ filepath })"
      >
        <v-icon>{{ isBookmarked({ filepath }) ? 'star' : 'star_border' }}</v-icon>
      </v-btn>
      <v-btn
        :title="'View'|accelerator('Enter')"
        :disabled="!filepath"
        flat
        icon
        @click="showViewer({ filepath })"
      >
        <v-icon>photo</v-icon>
      </v-btn>
      <v-text-field
        v-model="queryInput"
        name="query"
        class="mx-3 my-2 pt-0"
        label="Search"
        append-icon="search"
        single-line
        hide-details
        clearable
        @keyup="onKeyUp"
        @contextmenu="onContextMenu"
      />
    </v-card-title>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
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
    },
    ...mapState({
      filepath: state => state.explorer.filepath
    }),
    ...mapGetters({
      backDirectories: 'explorer/backDirectories',
      forwardDirectories: 'explorer/forwardDirectories',
      canBackDirectory: 'explorer/canBackDirectory',
      canForwardDirectory: 'explorer/canForwardDirectory',
      isBookmarked: 'bookmark/isBookmarked'
    })
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
    onKeyUp (e) {
      if (e.keyCode === 13) {
        this.search()
      }
    },
    showBackMenu (e) {
      ContextMenu.show(e, this.backDirectories.map((directory, index) => {
        return {
          label: directory,
          click: () => {
            this.backDirectory({ offset: index })
          }
        }
      }))
    },
    showForwardMenu (e) {
      ContextMenu.show(e, this.forwardDirectories.map((directory, index) => {
        return {
          label: directory,
          click: () => {
            this.forwardDirectory({ offset: index })
          }
        }
      }))
    },
    ...mapActions({
      changeDirectory: 'explorer/changeDirectory',
      changeParentDirectory: 'explorer/changeParentDirectory',
      changeHomeDirectory: 'explorer/changeHomeDirectory',
      backDirectory: 'explorer/backDirectory',
      forwardDirectory: 'explorer/forwardDirectory',
      search: 'explorer/search',
      showViewer: 'explorer/showViewer',
      toggleBookmark: 'bookmark/toggleBookmark'
    })
  }
}
</script>

<style scoped lang="scss">
.explorer-card /deep/ .input-group--text-field label {
  top: 0;
}
</style>
