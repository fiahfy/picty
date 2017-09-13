<template>
  <div class="viewer" @keyup.esc="esc">
    viewer
  </div>
</template>

<script>
export default {
  name: 'viewer',
  created () {
    document.addEventListener('keyup', this.keyup)
  },
  beforeDestroy () {
    document.removeEventListener('keyup', this.keyup)
  },
  methods: {
    keyup (e) {
      if (e.keyCode === 27) {
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style scoped lang="scss">
</style>
