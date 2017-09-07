<template>
  <div>
    main page
    <span v-for="file in files" :key="file">
      {{ file }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'main-page',
  asyncData ({ store, route }) {
    return store.dispatch('readDir', '')
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
