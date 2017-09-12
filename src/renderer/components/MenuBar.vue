<template>
  <div class="menu-bar">
    <div class="directory">
      <mdc-icon icon="folder"/>
      <mdc-textfield
        label="Input path..."
        fullwidth
        :defaultValue="directory"
        v-model="path"
        @keyupEnter="changeDirectory(path)"
      />
    </div>
    <div class="buttons">
      <mdc-button @click="changeParentDirectory()">
        <mdc-icon icon="arrow_upward" />
      </mdc-button>
      <mdc-button @click="refreshDirectory()">
        <mdc-icon icon="refresh" />
      </mdc-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import MdcButton from '../components/MdcButton';
import MdcIcon from '../components/MdcIcon';
import MdcTextfield from '../components/MdcTextfield';

export default {
  name: 'menu-bar',
  components: {
    MdcButton,
    MdcIcon,
    MdcTextfield,
  },
  data() {
    return {
      path: '',
    };
  },
  computed: mapState([
    'directory',
  ]),
  methods: {
    ...mapActions([
      'changeDirectory',
      'changeParentDirectory',
      'refreshDirectory',
    ]),
  },
};
</script>

<style scoped>
.menu-bar>div {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  padding: 4px;
}
.directory {
  display: flex;
}
.buttons {
  text-align: left;
}
.mdc-textfield {
  border: none;
  font-size: smaller;
  height: 32px;
}
.mdc-icon {
  padding: 4px;
}
.mdc-button {
  border-radius: 0;
  height: auto;
  line-height: initial;
  margin-right: auto;
  min-width: auto;
  padding: 0;
}
</style>
