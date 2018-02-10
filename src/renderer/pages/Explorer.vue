<template>
  <div class="explorer">
    <menu-bar />
    <divider />
    <div class="container">
      <div class="message" v-if="message">
        {{ message }}
      </div>
      <file-list />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Divider from '../components/Divider'
import FileList from '../components/FileList'
import MenuBar from '../components/MenuBar'

export default {
  components: {
    Divider,
    FileList,
    MenuBar
  },
  computed: {
    message () {
      if (this.error) {
        return this.error.message
      }
      if (!this.files.length) {
        return 'No Results'
      }
      return ''
    },
    ...mapState({
      error: state => state.explorer.error
    }),
    ...mapGetters({
      files: 'explorer/filteredFiles'
    })
  }
}
</script>

<style scoped lang="scss">
.explorer {
  display: flex;
  flex-direction: column;
  height: 100%;
  .container {
    flex: 1;
    height: 100%;
    overflow-y: auto;
    position: relative;
    .message {
      align-items: center;
      bottom: 0;
      display: flex;
      justify-content: center;
      left: 0;
      position: absolute;
      right: 0;
      top: 0;
    }
  }
}
</style>
