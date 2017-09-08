<template>
  <div class="activity-bar">
    <mdc-icon-toggle icon="favorite_border" checkedIcon="favorite" checked/>
  </div>
</template>

<script>
import MdcIconToggle from '../components/MdcIconToggle'

export default {
  name: 'activity-bar',
  components: { MdcIconToggle },
};
</script>

<style scoped>
.activity-bar {
  background-color: lightgoldenrodyellow;
  border-right-style: solid;
  border-right-width: 1px;
  width: 564px;
}
</style>
