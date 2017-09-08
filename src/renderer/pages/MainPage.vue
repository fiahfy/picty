<template>
  <div>
    main page
    <span v-for="file in files" :key="file.name">
      <pre>{{ file.stats }}</pre>
    </span>
  </div>
</template>

<script>
import { remote } from 'electron';

export default {
  name: 'main-page',
  asyncData ({ store, route }) {
    return store.dispatch('readDir', remote.app.getPath('home'))
  },
  computed: {
    files() {
      return this.$store.state.files
    }
  }
};
</script>

<style scoped>
</style>
