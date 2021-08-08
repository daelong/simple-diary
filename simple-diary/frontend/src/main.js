import Vue from 'vue';
import VueCookies from 'vue-cookies';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import config from './config';
import './styles/index.scss';

Vue.use(VueCookies);

Vue.$cookies.config('7d');
Vue.config.productionTip = false;
config.setup();

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
