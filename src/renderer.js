import Vue from 'vue';
import { sync } from 'vuex-router-sync';
import 'material-components-web/material-components-web.scss';
import 'material-design-icons/iconfont/material-icons.css';
import App from './renderer/App';
import router from './renderer/router';
import store from './renderer/store';
import './renderer/mixins';

Vue.config.devtools = process.env.NODE_ENV !== 'production';
Vue.config.productionTip = false;

sync(store, router);

new Vue({ // eslint-disable-line no-new
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
});
