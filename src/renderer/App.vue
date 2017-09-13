<template>
  <div id="app">
    <title-bar v-if="hasTitleBar"/>
    <div class="content">
      <router-view/>
    </div>
  </div>
</template>

<script>
import TitleBar from './components/TitleBar'

export default {
  name: 'app',
  components: {
    TitleBar
  },
  computed: {
    hasTitleBar () {
      return process.platform !== 'win32'
    }
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
.content {
  flex: 1;
  overflow: hidden;
}
</style>
