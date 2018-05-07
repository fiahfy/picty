<template>
  <div class="explorer-menu-bar">
    <v-toolbar
      flat
      dense
    >
      <v-icon
        color="blue lighten-3"
        class="ma-2 pa-1"
      >folder</v-icon>
      <v-text-field
        v-model="directoryInput"
        label="Path"
        single-line
        full-width
        hide-details
        @keyup="onDirectoryKeyup"
        @contextmenu="onContextMenu"
      />
    </v-toolbar>
    <v-divider />
    <v-toolbar
      flat
      dense
    >
      <v-btn
        ref="backButton"
        :title="'Back directory'|accelerator('CmdOrCtrl+Left')"
        :disabled="!canBackDirectory"
        flat
        icon
        color="primary"
        @click="backDirectory"
        @contextmenu="showBackMenu"
      >
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-menu
        v-model="backMenu.show"
        :position-x="backMenu.x"
        :position-y="backMenu.y"
      >
        <v-list>
          <v-list-tile
            v-for="(directory, index) in backDirectories"
            :key="index"
            @click="() => backDirectory({ offset: index })"
          >
            <v-list-tile-title>{{ directory }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-btn
        ref="forwardButton"
        :title="'Forward directory'|accelerator('CmdOrCtrl+Right')"
        :disabled="!canForwardDirectory"
        flat
        icon
        color="primary"
        @click="forwardDirectory"
        @contextmenu="showForwardMenu"
      >
        <v-icon>arrow_forward</v-icon>
      </v-btn>
      <v-menu
        v-model="forwardMenu.show"
        :position-x="forwardMenu.x"
        :position-y="forwardMenu.y"
      >
        <v-list>
          <v-list-tile
            v-for="(directory, index) in forwardDirectories"
            :key="index"
            @click="() => forwardDirectory({ offset: index })"
          >
            <v-list-tile-title>{{ directory }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-btn
        :title="'Change parent directory'|accelerator('CmdOrCtrl+Shift+P')"
        flat
        icon
        color="primary"
        @click="changeParentDirectory"
      >
        <v-icon>arrow_upward</v-icon>
      </v-btn>
      <v-btn
        :title="'Change home directory'|accelerator('CmdOrCtrl+Shift+H')"
        flat
        icon
        color="primary"
        @click="changeHomeDirectory"
      >
        <v-icon>home</v-icon>
      </v-btn>
      <v-btn
        title="Open current directory"
        flat
        icon
        color="primary"
        @click="openDirectory"
      >
        <v-icon>folder_open</v-icon>
      </v-btn>
      <v-btn
        :title="'Bookmark'|accelerator('CmdOrCtrl+D')"
        :disabled="!selectedFilepath"
        flat
        icon
        color="primary"
        @click="toggleBookmark({ filepath: selectedFilepath })"
      >
        <v-icon>{{ isBookmarked({ filepath: selectedFilepath}) ? 'star' : 'star_border' }}</v-icon>
      </v-btn>
      <v-btn
        :title="'View'|accelerator('Enter')"
        :disabled="!selectedFilepath"
        flat
        icon
        color="primary"
        @click="showViewer({ filepath: selectedFilepath })"
      >
        <v-icon>photo</v-icon>
      </v-btn>
      <v-icon
        :title="'Search'|accelerator('CmdOrCtrl+F')"
        class="ma-2 pa-1"
      >search</v-icon>
      <v-text-field
        v-model="queryInput"
        label="Search"
        single-line
        full-width
        hide-details
        clearable
        @keyup="onQueryKeyup"
        @contextmenu="onContextMenu"
      />
    </v-toolbar>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import * as ContextMenu from '../utils/context-menu'

export default {
  data () {
    return {
      backMenu: {
        show: false,
        x: 0,
        y: 0
      },
      forwardMenu: {
        show: false,
        x: 0,
        y: 0
      }
    }
  },
  computed: {
    directoryInput: {
      get () {
        return this.$store.state.explorer.directoryInput
      },
      set (value) {
        this.$store.commit('explorer/setDirectoryInput', { directoryInput: value })
      }
    },
    queryInput: {
      get () {
        return this.$store.state.explorer.queryInput
      },
      set (value) {
        this.$store.commit('explorer/setQueryInput', { queryInput: value })
      }
    },
    ...mapGetters({
      backDirectories: 'explorer/backDirectories',
      forwardDirectories: 'explorer/forwardDirectories',
      canBackDirectory: 'explorer/canBackDirectory',
      canForwardDirectory: 'explorer/canForwardDirectory',
      selectedFilepath: 'explorer/selectedFilepath',
      isBookmarked: 'bookmark/isBookmarked'
    })
  },
  watch: {
    queryInput () {
      this.search()
    }
  },
  mounted () {
    const backButtonRect = this.$refs.backButton.$el.getBoundingClientRect()
    this.backMenu.x = backButtonRect.left
    this.backMenu.y = backButtonRect.top
    const forwardButtonRect = this.$refs.forwardButton.$el.getBoundingClientRect()
    this.forwardMenu.x = forwardButtonRect.left
    this.forwardMenu.y = forwardButtonRect.top
  },
  methods: {
    onContextMenu (e) {
      ContextMenu.show(e, [
        { role: ContextMenu.Role.cut },
        { role: ContextMenu.Role.copy },
        { role: ContextMenu.Role.paste }
      ])
    },
    onDirectoryKeyup (e) {
      if (e.keyCode === 13) {
        this.changeDirectory({ dirpath: e.target.value })
      }
    },
    onQueryKeyup (e) {
      if (e.keyCode === 13) {
        this.search({ query: e.target.value })
      }
    },
    showBackMenu (e) {
      e.stopPropagation()
      e.preventDefault()
      this.backMenu.show = true
    },
    showForwardMenu (e) {
      e.stopPropagation()
      e.preventDefault()
      this.forwardMenu.show = true
    },
    ...mapActions({
      changeDirectory: 'explorer/changeDirectory',
      changeParentDirectory: 'explorer/changeParentDirectory',
      changeHomeDirectory: 'explorer/changeHomeDirectory',
      backDirectory: 'explorer/backDirectory',
      forwardDirectory: 'explorer/forwardDirectory',
      openDirectory: 'explorer/openDirectory',
      search: 'explorer/search',
      showViewer: 'explorer/showViewer',
      toggleBookmark: 'bookmark/toggleBookmark'
    })
  }
}
</script>

<style scoped lang="scss">
.explorer-menu-bar /deep/ .input-group>label {
  margin-left: 0;
}
</style>
