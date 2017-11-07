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

::-webkit-scrollbar {
        -webkit-appearance: none;
        width: 7px;
    }
    ::-webkit-scrollbar-thumb {
        border-radius: 4px;
        background-color: rgba(0,0,0,.5);
        -webkit-box-shadow: 0 0 1px rgba(255,255,255,.5);
    }

/*スクロールバー全体*/
// ::-webkit-scrollbar {
//     // width: 10px;
//   -webkit-overflow-scrolling: touch;
// }

/*スクロールバーの軌道*/
// ::-webkit-scrollbar-track {
//   border-radius: 10px;
//   box-shadow: inset 0 0 6px rgba(0, 0, 0, .1);
// }

// /*スクロールバーの動く部分*/
// ::-webkit-scrollbar-thumb {
//   background-color: rgba(0, 0, 50, .5);
//   border-radius: 10px;
//   box-shadow:0 0 0 1px rgba(255, 255, 255, .3);
// }
</style>
