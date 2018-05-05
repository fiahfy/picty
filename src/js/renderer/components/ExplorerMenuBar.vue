<template>
  <div class="explorer-menu-bar">
    <v-layout row>
      <v-icon class="ma-1 pa-2">folder</v-icon>
      <v-text-field
        v-model="directoryInput"
        label="Input path..."
        single-line
        hide-details
        full-width
        dense
        class="pt-2 pb-0 pl-0"
        @keyup="(e) => keyup(e, 'directory')"
        @contextmenu="contextmenu"
      />
    </v-layout>
    <v-divider />
    <v-layout row>
      <v-btn
        :title="'Back directory'|accelerator('CmdOrCtrl+Left')"
        :disabled="!canBackDirectory"
        flat
        icon
        color="primary"
        class="ma-1"
        @click="backDirectory"
      >
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-btn
        :title="'Forward directory'|accelerator('CmdOrCtrl+Right')"
        :disabled="!canForwardDirectory"
        flat
        icon
        color="primary"
        class="ma-1"
        @click="forwardDirectory"
      >
        <v-icon>arrow_forward</v-icon>
      </v-btn>
      <v-btn
        :title="'Change parent directory'|accelerator('CmdOrCtrl+Shift+P')"
        flat
        icon
        color="primary"
        class="ma-1"
        @click="changeParentDirectory"
      >
        <v-icon>arrow_upward</v-icon>
      </v-btn>
      <v-btn
        :title="'Change home directory'|accelerator('CmdOrCtrl+Shift+H')"
        flat
        icon
        color="primary"
        class="ma-1"
        @click="changeHomeDirectory"
      >
        <v-icon>home</v-icon>
      </v-btn>
      <v-btn
        title="Open current directory"
        flat
        icon
        color="primary"
        class="ma-1"
        @click="openDirectory"
      >
        <v-icon>folder_open</v-icon>
      </v-btn>
      <VerticalDivider />
      <v-btn
        :title="'Bookmark'|accelerator('CmdOrCtrl+D')"
        :disabled="!selectedFilepath"
        flat
        icon
        color="primary"
        class="ma-1"
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
        class="ma-1"
        @click="showViewer({ filepath: selectedFilepath })"
      >
        <v-icon>photo</v-icon>
      </v-btn>
      <VerticalDivider />
      <v-icon
        :title="'Search'|accelerator('CmdOrCtrl+F')"
        class="ma-1 pa-2"
      >folder</v-icon>
      <v-text-field
        v-model="queryInput"
        label="Search"
        single-line
        hide-details
        full-width
        dense
        clearable
        class="pt-2 pr-1 pb-0 pl-0"
        @keyup="(e) => keyup(e, 'search')"
        @contextmenu="contextmenu"
      />
    </v-layout>
    <!--
    <div class="row buttons">
      <mdc-menu-anchor>
        <mdc-button
          v-long-press="(e) => mouseLongPress(e, 'back')"
          :title="'Back directory'|accelerator('CmdOrCtrl+Left')"
          :disabled="!canBackDirectory"
          @click="backDirectory"
        >
          <mdc-icon
            slot="icon"
            icon="arrow_back"
          />
        </mdc-button>
        <mdc-menu
          ref="backMenu"
          v-model="backSelected"
        >
          <mdc-list-item
            v-for="(directory, index) in backDirectories"
            :key="index"
            @mouseup="mouseup"
          >
            {{ directory }}
          </mdc-list-item>
        </mdc-menu>
      </mdc-menu-anchor>
      <mdc-menu-anchor>
        <mdc-button
          v-long-press="(e) => mouseLongPress(e, 'forward')"
          :title="'Forward directory'|accelerator('CmdOrCtrl+Right')"
          :disabled="!canForwardDirectory"
          @click="forwardDirectory"
        >
          <mdc-icon
            slot="icon"
            icon="arrow_forward"
          />
        </mdc-button>
        <mdc-menu
          ref="forwardMenu"
          v-model="forwardSelected"
        >
          <mdc-list-item
            v-for="(directory, index) in forwardDirectories"
            :key="index"
            @mouseup="mouseup"
          >
            {{ directory }}
          </mdc-list-item>
        </mdc-menu>
      </mdc-menu-anchor>

    </div> -->
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import VerticalDivider from './VerticalDivider'
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
    VerticalDivider,
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
      backSelected: -1,
      forwardSelected: -1
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
    backSelected (value) {
      if (value !== -1) {
        this.backDirectory({ offset: value })
      }
      this.backSelected = -1
    },
    forwardSelected (value) {
      if (value !== -1) {
        this.forwardDirectory({ offset: value })
      }
      this.forwardSelected = -1
    },
    queryInput () {
      this.search()
    }
  },
  methods: {
    contextmenu (e) {
      ContextMenu.show(e, [
        { role: ContextMenu.Role.cut },
        { role: ContextMenu.Role.copy },
        { role: ContextMenu.Role.paste }
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
    click (e) {
      this.queryInput = ''
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
.layout>.icon {
  height: 36px;
  width: 36px;
}
.explorer-menu-bar /deep/ .input-group--text-field>label {
  margin-left: 0;
  top: unset;
}
.explorer-menu-bar /deep/ .input-group--text-field>.input-group__input>i {
  padding-bottom: 4px;
}
// .explorer-menu-bar {
//   .row {
//     display: flex;
//     height: 40px;
//     &.directory {
//       &>* {
//         margin: 4px;
//       }
//       .mdc-icon {
//         color: var(--icon-folder);
//       }
//     }
//     &.buttons {
//       text-align: left;
//       &>* {
//         margin: 2px;
//       }
//       .divider {
//         margin: 0;
//       }
//       .search-wrapper {
//         display: flex;
//         flex: 1;
//         margin: 0px;
//         position: relative;
//         &>* {
//           margin: 4px;
//         }
//         .mdc-icon {
//           color: var(--mdc-theme-text-icon-on-background);
//         }
//         .clear {
//           height: 32px;
//           margin: 4px;
//           min-width: 32px;
//           line-height: 32px;
//           position: absolute;
//           right: 0;
//         }
//       }
//       .mdc-button {
//         min-width: 36px;
//         padding: 0;
//         .mdc-icon {
//           font-size: 24px;
//           height: auto;
//           margin: 0;
//           padding: 0;
//           width: auto;
//         }
//       }
//     }
//     .mdc-list-item {
//       box-sizing: border-box;
//       height: 41px;
//     }
//     .mdc-text-field {
//       border: none;
//       height: 32px;
//       &:not(.mdc-text-field--disabled) /deep/ .mdc-text-field__input::placeholder {
//         color: var(--mdc-theme-text-hint-on-background);
//       }
//     }
//     .mdc-icon {
//       padding: 4px;
//     }
//   }
// }
</style>
