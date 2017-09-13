<template>
  <div class="title-bar">Picty</div>
</template>

<script>
export default {
  name: 'title-bar'
}
</script>

<style scoped lang="scss">
@import "~@material/theme/_color_palette.scss";

.title-bar {
  border-bottom-color: $material-color-grey-300;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  box-sizing: border-box;
  font-size: 13px;
  height: 24px;
  line-height: 24px;
  overflow: hidden;
  padding: 0 68px;
  text-align: center;
  text-overflow: ellipsis;
  user-select: none;
  -webkit-app-region: drag;
}
</style>
