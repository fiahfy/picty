<template>
  <div class="bookmark">
    <explorer-menu-bar />
    <divider />
    <div class="container">
      <div class="message" v-if="message">
        {{ message }}
      </div>
      <bookmark-list />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import BookmarkList from '../components/BookmarkList'
import ExplorerMenuBar from '../components/ExplorerMenuBar'
import Divider from '../components/Divider'

export default {
  components: {
    BookmarkList,
    ExplorerMenuBar,
    Divider
  },
  computed: {
    message () {
      return ''
    }
  }
}
</script>

<style scoped lang="scss">
.bookmark {
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
