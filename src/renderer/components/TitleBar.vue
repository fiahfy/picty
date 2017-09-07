<template>
  <div id="title-bar">Title</div>
</template>

<script>
export default {
  name: 'title-bar',
};
</script>

<style scoped>
#title-bar {
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
