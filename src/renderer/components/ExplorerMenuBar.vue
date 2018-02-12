<template>
  <div class="explorer-menu-bar">
    <div class="row directory">
      <mdc-icon icon="folder" />
      <mdc-text-field
        label="Input path..."
        fullwidth
        class="location"
        @keyup="(e) => keyup(e, 'directory')"
        @contextmenu="(e) => contextmenu(e, 'directory')"
        v-model="directoryInput"
      />
    </div>
    <divider />
    <div class="row buttons">
      <mdc-menu-anchor>
        <mdc-button
          class="icon"
          :title="'Back directory'|accelerator('CmdOrCtrl+Left')"
          :disabled="!canBackDirectory"
          @click="backDirectory"
          v-long-press="(e) => mouseLongPress(e, 'back')"
        >
          <mdc-icon icon="arrow_back" />
        </mdc-button>
        <mdc-menu ref="backMenu" v-model="backSelected">
          <mdc-list-item
            :key="index"
            @mouseup="mouseup"
            v-for="(directory, index) in backDirectories"
          >
            {{ directory }}
          </mdc-list-item>
        </mdc-menu>
      </mdc-menu-anchor>
      <mdc-menu-anchor>
        <mdc-button
          class="icon"
          :title="'Forward directory'|accelerator('CmdOrCtrl+Right')"
          :disabled="!canForwardDirectory"
          @click="forwardDirectory"
          v-long-press="(e) => mouseLongPress(e, 'forward')"
        >
          <mdc-icon icon="arrow_forward" />
        </mdc-button>
        <mdc-menu ref="forwardMenu" v-model="forwardSelected">
          <mdc-list-item
            :key="index"
            @mouseup="mouseup"
            v-for="(directory, index) in forwardDirectories"
          >
            {{ directory }}
          </mdc-list-item>
        </mdc-menu>
      </mdc-menu-anchor>
      <mdc-button
        class="icon"
        :title="'Change parent directory'|accelerator('CmdOrCtrl+Shift+P')"
        @click="changeParentDirectory"
      >
        <mdc-icon icon="arrow_upward" />
      </mdc-button>
      <mdc-button
        class="icon"
        :title="'Change home directory'|accelerator('CmdOrCtrl+Shift+H')"
        @click="changeHomeDirectory"
      >
        <mdc-icon icon="home" />
      </mdc-button>
      <mdc-button
        class="icon"
        title="Open current directory"
        @click="openDirectory"
      >
        <mdc-icon icon="folder_open" />
      </mdc-button>

      <divider orientation="vertical" />

      <mdc-button
        class="icon"
        :title="'Remove from bookmark'|accelerator('')"
        :disabled="!selectedFilepath"
        @click="deleteBookmark({ filepath: selectedFilepath })"
        v-if="isBookmarked({ filepath: selectedFilepath})"
      >
        <mdc-icon icon="star" />
      </mdc-button>
      <mdc-button
        class="icon"
        :title="'Add to bookmark'|accelerator('')"
        :disabled="!selectedFilepath"
        @click="bookmark({ filepath: selectedFilepath })"
        v-else
      >
        <mdc-icon icon="star_border" />
      </mdc-button>
      <mdc-button
        class="icon"
        :title="'View'|accelerator('Enter')"
        :disabled="!selectedFilepath"
        @click="showViewer({ filepath: selectedFilepath })"
      >
        <mdc-icon icon="photo" />
      </mdc-button>

      <divider orientation="vertical" />

      <div class="search-wrapper">
        <mdc-icon
          icon="search"
          :title="'Search'|accelerator('CmdOrCtrl+F')"
        />
        <mdc-text-field
          label="Search"
          fullwidth
          class="search"
          @keyup="(e) => keyup(e, 'search')"
          @contextmenu="(e) => contextmenu(e, 'search')"
          v-model="searchInput"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Divider from './Divider'
import MdcButton from './MdcButton'
import MdcIcon from './MdcIcon'
import MdcListItem from './MdcListItem'
import MdcMenuAnchor from './MdcMenuAnchor'
import MdcMenu from './MdcMenu'
import MdcTextField from './MdcTextField'
import * as ContextMenu from '../utils/context-menu'

export default {
  components: {
    Divider,
    MdcButton,
    MdcIcon,
    MdcListItem,
    MdcMenuAnchor,
    MdcMenu,
    MdcTextField
  },
  data () {
    return {
      backSelected: null,
      forwardSelected: null,
      searchInput: ''
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
  methods: {
    contextmenu (e, mode) {
      ContextMenu.show(e, [
        { label: ContextMenu.LABEL_CUT },
        { label: ContextMenu.LABEL_COPY },
        {
          label: ContextMenu.LABEL_PASTE,
          callback: async (value) => {
            if (mode === 'directory') {
              this.directoryInput = value
            } else {
              this.searchInput = value
            }
            await this.$nextTick()
          }
        }
      ])
    },
    keyup (e, mode) {
      if (e.keyCode === 13) {
        if (mode === 'directory') {
          this.changeDirectory({ dirpath: e.target.value })
        } else {
          this.search({ query: e.target.value })
        }
      }
    },
    mouseLongPress (e, direction) {
      e.target.parentNode.blur()
      // TODO: Remove remained ripple classes
      e.target.parentNode.classList.remove('mdc-ripple-upgraded--background-active-fill')
      e.target.parentNode.classList.remove('mdc-ripple-upgraded--foreground-activation')
      if (direction === 'back') {
        this.$refs.backMenu.show()
        this.$refs.forwardMenu.hide()
      } else {
        this.$refs.backMenu.hide()
        this.$refs.forwardMenu.show()
      }
    },
    mouseup (e) {
      e.target.click()
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
      bookmark: 'bookmark/bookmark',
      deleteBookmark: 'bookmark/deleteBookmark'
    })
  },
  watch: {
    backSelected (value) {
      if (value !== null) {
        this.backDirectory({ offset: value })
      }
      this.backSelected = null
    },
    forwardSelected (value) {
      if (value !== null) {
        this.forwardDirectory({ offset: value })
      }
      this.forwardSelected = null
    },
    searchInput (value) {
      this.search({ query: value })
    }
  }
}
</script>

<style scoped lang="scss">
@import "@material/theme/_color-palette";

.explorer-menu-bar {
  user-select: none;
  .row {
    display: flex;
    height: 40px;
    &.directory {
      &>* {
        margin: 4px;
      }
      &>.mdc-icon {
        color: $material-color-blue-200;
      }
    }
    &.buttons {
      text-align: left;
      &>* {
        margin: 2px;
      }
      &>.divider {
        margin: 0;
      }
      &>.search-wrapper {
        display: flex;
        flex: 1;
        margin: 0px;
        &>* {
          margin: 4px;
        }
      }
    }
    .mdc-list-item {
      box-sizing: border-box;
      height: 41px;
    }
    .mdc-text-field {
      border: none;
      height: 32px;
    }
  }
}
</style>
