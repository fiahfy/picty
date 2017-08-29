import Vue from 'vue';
import App from './renderer/App.vue';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
});
/* eslint-enable no-new */
