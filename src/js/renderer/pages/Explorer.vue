<template>
  <v-container
    fluid
    fill-height
    pa-0
    class="explorer"
  >
    <v-layout column>
      <explorer-menu-bar />
      <v-divider />
      <v-flex fill-height>
        <explorer-list />
      </v-flex>
    </v-layout>
    <!-- <explorer-menu-bar />
    <divider />
    <div class="container">
      <div
        v-if="message"
        class="message"
      >
        {{ message }}
      </div>
      <explorer-list />
    </div> -->
  </v-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import ExplorerList from '../components/ExplorerList'
import ExplorerMenuBar from '../components/ExplorerMenuBar'
import Divider from '../components/Divider'

export default {
  components: {
    ExplorerList,
    ExplorerMenuBar,
    Divider
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
.flex {
  overflow: hidden;
}
// .explorer {
//   display: flex;
//   flex-direction: column;
//   height: 100%;
//   .container {
//     flex: 1;
//     overflow-y: auto;
//     position: relative;
//     .message {
//       align-items: center;
//       bottom: 0;
//       color: var(--mdc-theme-text-secondary-on-background);
//       display: flex;
//       justify-content: center;
//       left: 0;
//       pointer-events: none;
//       position: absolute;
//       right: 0;
//       top: 0;
//     }
//   }
// }
</style>
