<template>
  <div class="container">
    <activity-bar/>
    <div class="content">
      <router-view/>
    </div>
  </div>
</template>

<script>
import ActivityBar from '../components/ActivityBar'

export default {
  name: 'container',
  components: {
    ActivityBar
  }
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  height: 100%;
}
.content {
  flex: 1;
}
</style>
