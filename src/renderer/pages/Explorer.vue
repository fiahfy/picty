<template>
  <div class="explorer">
    <menu-bar/>
    <file-list/>
  </div>
</template>

<script>
import MenuBar from '../components/MenuBar'
import FileList from '../components/FileList'

export default {
  components: {
    MenuBar,
    FileList
  },
  async asyncData ({ store }) {
    await store.dispatch('explorer/refreshDirectory')
  }
}
</script>

<style scoped lang="scss">
.explorer {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.file-list {
  flex: 1;
}
</style>
