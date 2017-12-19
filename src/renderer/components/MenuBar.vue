<template>
  <div class="menu-bar">
    <div class="row directory">
      <mdc-icon icon="folder" />
      <mdc-text-field
        label="Input path..."
        fullwidth
        class="location"
        @keyup="keyup"
        v-model="directoryInput"
      />
    </div>
    <div class="row buttons">
      <mdc-menu-anchor>
        <mdc-button
          title="Back drectory"
          :disabled="!canBackDirectory"
          @click.native="backDirectory"
          v-long-press="(e) => mouseLongPress(e, 'back')"
        >
          <mdc-icon icon="arrow_back" />
        </mdc-button>
        <mdc-simple-menu ref="backMenu" v-model="backSelected">
          <mdc-list-item
            :key="directory"
            @mouseup.native="mouseup(index)"
            v-for="(directory, index) in backDirectories"
          >
            {{ directory }}
          </mdc-list-item>
        </mdc-simple-menu>
      </mdc-menu-anchor>
      <mdc-menu-anchor>
        <mdc-button
          title="Forward drectory"
          :disabled="!canForwardDirectory"
          @click.native="forwardDirectory"
          v-long-press="(e) => mouseLongPress(e, 'forward')"
        >
          <mdc-icon icon="arrow_forward" />
        </mdc-button>
        <mdc-simple-menu ref="forwardMenu" v-model="forwardSelected">
          <mdc-list-item
            :key="directory"
            @mouseup.native="mouseup(index)"
            v-for="(directory, index) in forwardDirectories"
          >
            {{ directory }}
          </mdc-list-item>
        </mdc-simple-menu>
      </mdc-menu-anchor>
      <mdc-button
        title="Change parent drectory"
        @click.native="changeParentDirectory"
      >
        <mdc-icon icon="arrow_upward" />
      </mdc-button>
      <mdc-button
        title="Change home drectory"
        @click.native="changeHomeDirectory"
      >
        <mdc-icon icon="home" />
      </mdc-button>
      <div class="separator" />
      <mdc-button
        title="View"
        :disabled="!selectedFile"
        @click.native="showSelectedFile"
      >
        <mdc-icon icon="photo" />
      </mdc-button>
      <div class="separator" />
      <mdc-button
        title="Open current directory"
        @click.native="openDirectory"
      >
        <mdc-icon icon="folder_open" />
      </mdc-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import MdcButton from '../components/MdcButton'
import MdcIcon from '../components/MdcIcon'
import MdcListItem from '../components/MdcListItem'
import MdcMenuAnchor from '../components/MdcMenuAnchor'
import MdcSimpleMenu from '../components/MdcSimpleMenu'
import MdcTextField from '../components/MdcTextField'

export default {
  components: {
    MdcButton,
    MdcIcon,
    MdcListItem,
    MdcMenuAnchor,
    MdcSimpleMenu,
    MdcTextField
  },
  data () {
    return {
      backSelected: null,
      forwardSelected: null
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
    ...mapState('explorer', [
      'selectedFile'
    ]),
    ...mapGetters('explorer', [
      'backDirectories',
      'forwardDirectories',
      'canBackDirectory',
      'canForwardDirectory'
    ])
  },
  methods: {
    keyup (e) {
      if (e.keyCode === 13) {
        this.changeDirectory({ directory: e.target.value })
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
    mouseup (index) {
      // this.click(index)
    },
    ...mapActions('explorer', [
      'changeDirectory',
      'changeParentDirectory',
      'changeHomeDirectory',
      'refreshDirectory',
      'backDirectory',
      'forwardDirectory',
      'openDirectory'
    ]),
    ...mapActions('viewer', [
      'showSelectedFile'
    ])
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
}
.row {
  border-bottom-color: $material-color-grey-300;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  height: 40px;
}
.row>* {
  display: inline-block;
  margin: 4px;
  vertical-align: bottom;
}
.separator {
  border-left-color: $material-color-grey-300;
  border-left-style: solid;
  border-left-width: 1px;
  display: inline-block;
  height: 100%;
  margin: 0;
}
.directory {
  display: flex;
  .mdc-icon {
    color: $material-color-blue-200;
  }
}
.buttons {
  text-align: left;
}
.mdc-list-item {
  box-sizing: border-box;
  font-size: smaller;
  height: 41px;
}
.mdc-text-field {
  border: none;
  font-size: smaller;
  height: 32px;
}
.mdc-icon {
  padding: 4px;
}
.mdc-button {
  border-radius: 0;
  height: auto;
  line-height: initial;
  margin-right: auto;
  min-width: auto;
  padding: 0;
}
.mdc-theme--dark {
  .row {
    border-bottom-color: $material-color-grey-600;
  }
  .separator {
    border-left-color: $material-color-grey-600;
  }
}
</style>
