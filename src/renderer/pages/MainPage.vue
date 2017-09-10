<template>
  <div class="main-page">
    <div class="menu-bar">
      <mdc-textfield
        label="Input path..."
        fullwidth
        :defaultValue="defaultPath"
        v-model="path"
        @keyupEnter="keyupEnter"
      />
    </div>
    <div class="content">
      <span v-for="file in files" :key="file.name">
        <pre>{{ file.stats }}</pre>
      </span>
    </div>
  </div>
</template>

<script>
import { remote } from 'electron';
import MdcTextfield from '../components/MdcTextfield';

export default {
  name: 'main-page',
  components: { MdcTextfield },
  mounted() {
  },
  asyncData({ store }) {
    return store.dispatch('changePath', remote.app.getPath('home'));
  },
  data() {
    return {
      path: '',
    };
  },
  computed: {
    defaultPath() {
      return this.$store.state.path;
    },
    files() {
      return this.$store.state.files;
    },
  },
  methods: {
    keyupEnter() {
      this.$store.dispatch('changePath', this.path);
    },
  },
};
</script>

<style scoped>
.main-page {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.content {
  flex: 1;
  overflow-y: auto;
}
.mdc-textfield {
  font-size: smaller;
  height: 32px;
  padding: 0 8px;
}
</style>
