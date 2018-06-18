<template>
  <v-system-bar
    v-if="titleBar"
    :app="app"
    class="title-bar"
    height="22"
    status
  >
    <v-spacer/>
    <span>{{ title }}</span>
    <v-spacer/>
  </v-system-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import Package from '~~/package.json'

export default {
  props: {
    app: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    title () {
      return Package.productName
    },
    ...mapGetters({
      titleBar: 'titleBar'
    })
  }
}
</script>

<style scoped lang="scss">
.title-bar {
  -webkit-app-region: drag;
}
</style>
