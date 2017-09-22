<template>
  <div class="explorer">
    <menu-bar/>
    <div class="container">
      <div class="error" v-if="error">
        <span>{{ error.message }}</span>
      </div>
      <file-list v-else/>
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
  async asyncData ({ store }) {
    await store.dispatch('explorer/refreshDirectory')
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
}
.error {
  display: table;
  height: 100%;
  vertical-align: middle;
  width: 100%;
  span {
    display: table-cell;
    text-align: center;
    vertical-align: middle;
  }
}
</style>
