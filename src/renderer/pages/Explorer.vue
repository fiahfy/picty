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
</style>
