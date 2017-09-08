<template>
  <div class="activity-bar">
    <mdc-icon-toggle icon="list" />
    <mdc-icon-toggle icon="settings"/>
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
  border-right-style: solid;
  border-right-width: 1px;
  overflow: hidden;
  width: 48px;
}
.mdc-icon-toggle {
  display: block;
}
</style>
