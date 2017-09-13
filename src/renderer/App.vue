<template>
  <div id="app">
    <title-bar v-if="hasTitleBar"/>
    <div class="content-wrapper">
      <activity-bar/>
      <div class="content">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script>
import ActivityBar from './components/ActivityBar'
import TitleBar from './components/TitleBar'

export default {
  name: 'app',
  components: {
    ActivityBar,
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

#app>.content-wrapper {
  display: flex;
  flex: 1;
}

#app>.content-wrapper>.content {
  flex: 1;
  overflow-y: auto;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
