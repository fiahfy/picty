<template>
  <div class="menu-bar">
    <div class="row directory">
      <mdc-icon icon="folder" />
      <mdc-text-field
        label="Input path..."
        fullwidth
        class="location"
        @keyup="directoryInputKeyup"
        @contextmenu="contextmenu"
        v-model="directoryInput"
      />
    </div>
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
      <div class="separator" />
      <mdc-button
        class="icon"
        :title="'View'|accelerator('Enter')"
        @click="showSelectedFile"
      >
        <mdc-icon icon="photo" />
      </mdc-button>
      <div class="separator" />
      <mdc-button
        class="icon"
        title="Open current directory"
        @click="openDirectory"
      >
        <mdc-icon icon="folder_open" />
      </mdc-button>
      <div class="separator" />
      <div class="search-wrapper">
        <mdc-icon
          icon="search"
          :title="'Search'|accelerator('CmdOrCtrl+F')"
        />
        <mdc-text-field
          label="Search"
          fullwidth
          class="search"
          @keyup="searchInputKeyup"
          @contextmenu="contextmenu"
          v-model="searchInput"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import MdcButton from '../components/MdcButton'
import MdcIcon from '../components/MdcIcon'
import MdcListItem from '../components/MdcListItem'
import MdcMenuAnchor from '../components/MdcMenuAnchor'
import MdcMenu from '../components/MdcMenu'
import MdcTextField from '../components/MdcTextField'
import * as ContextMenu from '../utils/context-menu'

export default {
  components: {
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
      canForwardDirectory: 'explorer/canForwardDirectory'
    })
  },
  methods: {
    contextmenu (e) {
      ContextMenu.show(e, [
        { label: ContextMenu.LABEL_CUT },
        { label: ContextMenu.LABEL_COPY },
        { label: ContextMenu.LABEL_PASTE }
      ])
    },
    directoryInputKeyup (e) {
      if (e.keyCode === 13) {
        this.changeDirectory({ dirpath: e.target.value })
      }
    },
    searchInputKeyup (e) {
      this.search({ query: e.target.value })
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
      showSelectedFile: 'viewer/showSelectedFile'
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
    }
  }
}
</script>

<style scoped lang="scss">
@import "~@material/theme/_color-palette.scss";

.menu-bar {
  user-select: none;
  .row {
    border-bottom: {
      color: $material-color-grey-300;
      style: solid;
      width: 1px;
    }
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
    .separator {
      border-left: {
        color: $material-color-grey-300;
        style: solid;
        width: 1px;
      }
      display: inline-block;
      height: 100%;
      margin: 0;
    }
  }
}
.mdc-theme--dark {
  .row {
    border-bottom-color: $material-color-grey-600;
    .separator {
      border-left-color: $material-color-grey-600;
    }
  }
}
</style>
