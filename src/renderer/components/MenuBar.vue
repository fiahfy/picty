<template>
  <div class="menu-bar">
    <div class="row directory">
      <mdc-icon icon="folder"/>
      <mdc-textfield
        label="Input path..."
        fullwidth
        @keyup="keyup"
        v-model="directoryInput"
      />
    </div>
    <div class="row buttons">
      <mdc-button
        title="Change parent drectory"
        @click="changeParentDirectory"
      >
        <mdc-icon icon="arrow_upward" />
      </mdc-button>
      <mdc-button
        title="View"
        @click="showViewerWithSelectedFile"
      >
        <mdc-icon icon="photo" />
      </mdc-button>
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
import { mapActions } from 'vuex'
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
      set (value) {
        this.$store.commit('explorer/setDirectoryInput', value)
      }
    }
  },
  methods: {
    keyup (e) {
      if (event.keyCode === 13) {
        this.changeDirectory(e.target.value)
      }
    },
    ...mapActions('explorer', [
      'changeDirectory',
      'changeParentDirectory',
      'refreshDirectory',
      'openDirectory'
    ]),
    ...mapActions('viewer', [
      'showViewerWithSelectedFile'
    ])
  }
}
</script>

<style scoped lang="scss">
@import "~@material/theme/_color_palette.scss";

.menu-bar {
  user-select: none;
}
.row {
  border-bottom-color: $material-color-grey-300;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  padding: 4px;
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
}
</style>
