<template>
  <div class="explorer">
    <menu-bar />
    <div class="container">
      <div class="error" v-if="error">
        <span>{{ error.message }}</span>
      </div>
      <file-list />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import FileList from '../components/FileList'
import MenuBar from '../components/MenuBar'

export default {
  components: {
    FileList,
    MenuBar
  },
  computed: mapState('explorer', [
    'error'
  ])
}
</script>

<style scoped lang="scss">
@import "~@material/theme/_color-palette.scss";

.explorer {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.container {
  flex: 1;
  height: 100%;
  overflow-y: auto;
  position: relative;
}
.error {
  bottom: 0;
  display: table;
  height: 100%;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  vertical-align: middle;
  width: 100%;
  span {
    display: table-cell;
    text-align: center;
    vertical-align: middle;
  }
}

::-webkit-scrollbar {
  -webkit-appearance: none;
  border-left-color: $material-color-grey-300;
  border-left-style: solid;
  border-left-width: 1px;
  width: 14px;
}
::-webkit-scrollbar-thumb {
  background-color: $material-color-grey-300;
  &:hover {
    background-color: $material-color-grey-400;
  }
  &:active {
    background-color: $material-color-grey-500;
  }
}

.mdc-theme--dark {
  color: white;
  &.mdc-theme--background, .mdc-theme--background {
    background-color: #303030;
  }
  ::-webkit-scrollbar {
    border-left-color: $material-color-grey-600;
  }
  ::-webkit-scrollbar-thumb {
    background-color: $material-color-grey-600;
    &:hover {
      background-color: $material-color-grey-500;
    }
    &:active {
      background-color: $material-color-grey-400;
    }
  }
}
</style>
