<template>
  <v-system-bar
    :app="app"
    class="title-bar"
    height="22"
    status
  >
    <v-spacer/>
    <span>Picty</span>
    <v-spacer/>
  </v-system-bar>
</template>

<script>
export default {
  props: {
    app: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped lang="scss">
.system-bar {
  -webkit-app-region: drag;
}
</style>
