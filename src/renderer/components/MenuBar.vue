<template>
  <div class="menu-bar">
    <div class="row directory">
      <mdc-icon icon="folder"/>
      <mdc-textfield
        label="Input path..."
        fullwidth
        class="location"
        @keyup="keyup"
        v-model="directoryInput"
      />
    </div>
    <div class="row buttons">
      <mdc-button
        title="Back drectory"
        :disabled="!canBackDirectory"
        @click="backDirectory"
      >
        <mdc-icon icon="arrow_back" />
      </mdc-button>
      <mdc-button
        title="Forward drectory"
        :disabled="!canForwardDirectory"
        @click="forwardDirectory"
      >
        <mdc-icon icon="arrow_forward" />
      </mdc-button>
      <mdc-button
        title="Change parent drectory"
        @click="changeParentDirectory"
      >
        <mdc-icon icon="arrow_upward" />
      </mdc-button>
      <mdc-button
        title="Change home drectory"
        @click="changeHomeDirectory"
      >
        <mdc-icon icon="home" />
      </mdc-button>
      <div class="separator" />
      <mdc-button
        title="View"
        :disabled="!selectedFile"
        @click="showSelectedFile"
      >
        <mdc-icon icon="photo" />
      </mdc-button>
      <div class="separator" />
      <mdc-button
        title="Open current directory"
        @click="openDirectory"
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
import MdcTextfield from '../components/MdcTextfield'

export default {
  components: {
    MdcButton,
    MdcIcon,
    MdcTextfield
  },
  computed: {
    directoryInput: {
      get () {
        return this.$store.state.explorer.directoryInput
      },
      set (dir) {
        this.$store.commit('explorer/setDirectoryInput', { dir })
      }
    },
    ...mapState('explorer', [
      'selectedFile'
    ]),
    ...mapGetters('explorer', [
      'canBackDirectory',
      'canForwardDirectory'
    ])
  },
  methods: {
    keyup (e) {
      if (event.keyCode === 13) {
        this.changeDirectory({ dir: e.target.value })
      }
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
.mdc-textfield {
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
