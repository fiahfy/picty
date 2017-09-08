<template>
  <div>
    <mdc-textfield label="Input path..." fullwidth/>

    <span v-for="file in files" :key="file.name">
      <pre>{{ file.stats }}</pre>
    </span>
  </div>
</template>

<script>
import { remote } from 'electron';
import MdcTextfield from '../components/MdcTextfield'

export default {
  name: 'main-page',
  components: { MdcTextfield },
  mounted() {
    // console.warn("OK");
    // console.log(mdcSelect);
    // const select = new mdcSelect.MDCSelect(document.querySelector('.mdc-select'));
    // select.listen('MDCSelect:change', () => {
    //   alert(`Selected "${select.selectedOptions[0].textContent}" at index ${select.selectedIndex} ` +
    //         `with value "${select.value}"`);
    // });
  },
  asyncData ({ store, route }) {
    return store.dispatch('readDir', remote.app.getPath('home'))
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
