import Vue from 'vue';
import App from './renderer/App';
import router from './renderer/router';

Vue.config.devtools = false;
Vue.config.productionTip = false;


new Vue({ // eslint-disable-line no-new
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
