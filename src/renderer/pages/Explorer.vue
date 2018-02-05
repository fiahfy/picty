<template>
  <div class="explorer">
    <menu-bar />
    <div class="container">
      <div class="error" v-if="error">
        {{ error.message }}
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
  computed: mapState({
    error: state => state.explorer.error
  })
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
  align-items: center;
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}
</style>
