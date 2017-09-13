<template>
  <div id="app">
    <title-bar v-if="hasTitleBar"/>
    <div class="container" v-show="!isViewing">
      <activity-bar/>
      <div class="content">
        <router-view/>
      </div>
    </div>
    <viewer v-if="isViewing"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ActivityBar from './components/ActivityBar'
import TitleBar from './components/TitleBar'
import Viewer from './components/Viewer'

export default {
  name: 'app',
  components: {
    ActivityBar,
    TitleBar,
    Viewer
  },
  computed: {
    hasTitleBar () {
      return process.platform !== 'win32'
    },
    ...mapState([
      'isViewing'
    ])
  }
}
</script>

<style scoped lang="scss">
#app {
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  height: 100%;
  text-align: center;
}
.container {
  display: flex;
  flex: 1;
  overflow: hidden;
}
.content {
  flex: 1;
}
</style>
