<template>
  <v-card
    class="explorer-card"
    flat
  >
    <v-card-title class="py-2 px-0">
      <v-btn
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
        :title="'Bookmark'|accelerator('CmdOrCtrl+D')"
        :disabled="!selectedFilepath"
        flat
        icon
        @click="toggleBookmark({ filepath: selectedFilepath })"
      >
        <v-icon>{{ isBookmarked({ filepath: selectedFilepath}) ? 'star' : 'star_border' }}</v-icon>
      </v-btn>
      <v-btn
        :title="'View'|accelerator('Enter')"
        :disabled="!selectedFilepath"
        flat
        icon
        @click="showViewer({ filepath: selectedFilepath })"
      >
        <v-icon>photo</v-icon>
      </v-btn>
      <v-text-field
        v-model="queryInput"
        class="mx-3"
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
    queryInput: {
      get () {
        return this.$store.state.explorer.queryInput
      },
      set (value) {
        this.$store.commit('explorer/setQueryInput', { queryInput: value })
      }
    },
    ...mapState({
      selectedFilepath: state => state.explorer.selectedFilepath
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
  mounted () {
    this.$nextTick(() => {
      const backButtonRect = this.$refs.backButton.$el.getBoundingClientRect()
      this.backMenu.x = backButtonRect.left
      this.backMenu.y = backButtonRect.top
      const forwardButtonRect = this.$refs.forwardButton.$el.getBoundingClientRect()
      this.forwardMenu.x = forwardButtonRect.left
      this.forwardMenu.y = forwardButtonRect.top
    })
  },
  methods: {
    onContextMenu (e) {
      ContextMenu.showTextMenu(e)
    },
    onKeyUp (e) {
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
      search: 'explorer/search',
      showViewer: 'explorer/showViewer',
      toggleBookmark: 'bookmark/toggleBookmark'
    })
  }
}
</script>
