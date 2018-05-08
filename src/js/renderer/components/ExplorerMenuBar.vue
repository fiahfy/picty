<template>
  <v-toolbar
    class="explorer-menu-bar"
    flat
    dense
    extended
  >
    <v-text-field
      v-model="directoryInput"
      label="Path"
      prepend-icon="folder"
      single-line
      hide-details
      @keyup="onDirectoryKeyup"
      @contextmenu="onContextMenu"
    />
    <v-btn
      title="Open current directory"
      flat
      icon
      @click="openDirectory"
    >
      <v-icon>open_in_browser</v-icon>
    </v-btn>
    <v-btn
      slot="extension"
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
      slot="extension"
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
      slot="extension"
      :title="'Change parent directory'|accelerator('CmdOrCtrl+Shift+P')"
      flat
      icon
      @click="changeParentDirectory"
    >
      <v-icon>arrow_upward</v-icon>
    </v-btn>
    <v-btn
      slot="extension"
      :title="'Change home directory'|accelerator('CmdOrCtrl+Shift+H')"
      flat
      icon
      @click="changeHomeDirectory"
    >
      <v-icon>home</v-icon>
    </v-btn>
    <v-btn
      slot="extension"
      :title="'Bookmark'|accelerator('CmdOrCtrl+D')"
      :disabled="!selectedFilepath"
      flat
      icon
      @click="toggleBookmark({ filepath: selectedFilepath })"
    >
      <v-icon>{{ isBookmarked({ filepath: selectedFilepath}) ? 'star' : 'star_border' }}</v-icon>
    </v-btn>
    <v-btn
      slot="extension"
      :title="'View'|accelerator('Enter')"
      :disabled="!selectedFilepath"
      flat
      icon
      @click="showViewer({ filepath: selectedFilepath })"
    >
      <v-icon>photo</v-icon>
    </v-btn>
  </v-toolbar>
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
    ...mapGetters({
      backDirectories: 'explorer/backDirectories',
      forwardDirectories: 'explorer/forwardDirectories',
      canBackDirectory: 'explorer/canBackDirectory',
      canForwardDirectory: 'explorer/canForwardDirectory',
      selectedFilepath: 'explorer/selectedFilepath',
      isBookmarked: 'bookmark/isBookmarked'
    })
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
      ContextMenu.showTextMenu(e)
    },
    onDirectoryKeyup (e) {
      if (e.keyCode === 13) {
        this.changeDirectory({ dirpath: e.target.value })
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
