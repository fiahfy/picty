<template>
  <div class="title-bar">Picty</div>
</template>

<style scoped lang="scss">
@import "~@material/theme/_color-palette.scss";

.title-bar {
  border-bottom: {
    color: $material-color-grey-300;
    style: solid;
    width: 1px;
  }
  box-sizing: border-box;
  font-size: smaller;
  height: 24px;
  line-height: 24px;
  overflow: hidden;
  padding: 0 68px;
  text-align: center;
  text-overflow: ellipsis;
  user-select: none;
  -webkit-app-region: drag;
}
.mdc-theme--dark .title-bar {
  border-bottom-color: $material-color-grey-600;
}
</style>
