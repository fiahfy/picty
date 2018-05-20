<template>
  <v-card
    class="explorer-card"
    flat
  >
    <v-card-title class="py-2 px-0">
      <v-btn
        v-long-press="showBackMenu"
        :title="'Back'|accelerator('CmdOrCtrl+Left')"
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
        :title="'Forward'|accelerator('CmdOrCtrl+Right')"
        :disabled="!canForwardDirectory"
        flat
        icon
        @click="forwardDirectory"
        @contextmenu="showForwardMenu"
      >
        <v-icon>arrow_forward</v-icon>
      </v-btn>
      <v-btn
        :title="'Up'|accelerator('CmdOrCtrl+Shift+P')"
        flat
        icon
        @click="upDirectory"
      >
        <v-icon>arrow_upward</v-icon>
      </v-btn>
      <v-btn
        title="Reload"
        flat
        icon
        @click="reloadDirectory"
      >
        <v-icon>refresh</v-icon>
      </v-btn>
      <v-btn
        :title="'Home'|accelerator('CmdOrCtrl+Shift+H')"
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
        return this.$store.state.app.explorer.queryInput
      },
      set (value) {
        this.$store.commit('app/explorer/setQueryInput', { queryInput: value })
      }
    },
    ...mapState({
      filepath: state => state.app.explorer.filepath
    }),
    ...mapGetters({
      backDirectories: 'app/explorer/backDirectories',
      forwardDirectories: 'app/explorer/forwardDirectories',
      canBackDirectory: 'app/explorer/canBackDirectory',
      canForwardDirectory: 'app/explorer/canForwardDirectory',
      isBookmarked: 'app/explorer/isBookmarked'
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
      changeDirectory: 'app/explorer/changeDirectory',
      upDirectory: 'app/explorer/upDirectory',
      changeHomeDirectory: 'app/explorer/changeHomeDirectory',
      backDirectory: 'app/explorer/backDirectory',
      forwardDirectory: 'app/explorer/forwardDirectory',
      reloadDirectory: 'app/explorer/reloadDirectory',
      search: 'app/explorer/search',
      showViewer: 'app/explorer/showViewer',
      toggleBookmark: 'app/explorer/toggleBookmark'
    })
  }
}
</script>

<style scoped lang="scss">
.explorer-card /deep/ .input-group--text-field label {
  top: 0;
}
</style>
