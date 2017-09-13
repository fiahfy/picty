<template>
  <div class="main-page">
    <template v-if="isViewing">
      <viewer/>
    </template>
    <template v-else>
      <menu-bar/>
      <file-list/>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MenuBar from '../components/MenuBar'
import FileList from '../components/FileList'
import Viewer from '../components/Viewer'

export default {
  name: 'main-page',
  components: {
    MenuBar,
    FileList,
    Viewer
  },
  async asyncData ({ store }) {
    await store.dispatch('changeDirectory', store.state.directory)
  },
  computed: mapState([
    'isViewing'
  ])
}
</script>

<style scoped lang="scss">
.main-page {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.file-list {
  flex: 1;
}
</style>
