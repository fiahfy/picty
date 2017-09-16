<template>
  <div class="menu-bar">
    <div class="directory">
      <mdc-icon icon="folder"/>
      <mdc-textfield
        label="Input path..."
        fullwidth
        @keyup="keyup"
        v-model="directory"
      />
    </div>
    <div class="buttons">
      <mdc-button
        title="Change parent drectory"
        @click="changeParentDirectory"
      >
        <mdc-icon icon="arrow_upward" />
      </mdc-button>
      <mdc-button
        title="Refresh"
        @click="refreshDirectory"
      >
        <mdc-icon icon="refresh" />
      </mdc-button>
      <mdc-button
        title="View"
        @click="showViewerWithSelectedFile"
      >
        <mdc-icon icon="photo" />
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
  data () {
    return {
      path: ''
    }
  },
  computed: {
    directory: {
      get () {
        return this.$store.state.directory
      },
      set (value) {
        this.$store.commit('setDirectory', value)
      }
    }
  },
  methods: {
    keyup (e) {
      if (event.keyCode === 13) {
        this.changeDirectory(e.target.value)
      }
    },
    ...mapActions([
      'changeDirectory',
      'changeParentDirectory',
      'refreshDirectory',
      'showViewerWithSelectedFile'
    ])
  }
}
</script>

<style scoped lang="scss">
@import "~@material/theme/_color_palette.scss";

.menu-bar>div {
  border-bottom: 1px solid $material-color-grey-300;
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
</style>
