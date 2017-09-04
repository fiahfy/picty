<template>
  <div id="app">
    <title-bar/>
    <div class="content-wrapper">
      <activity-bar/>
      <div class="content">
        <ul>
          <li><router-link to="/">Go Main</router-link></li>
          <li><router-link to="/settings">Go Settings</router-link></li>
        </ul>
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script>
import ActivityBar from './components/ActivityBar';
import TitleBar from './components/TitleBar';

export default {
  name: 'app',
  components: { ActivityBar, TitleBar },
}
</script>

<style scoped>
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
