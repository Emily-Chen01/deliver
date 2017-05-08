// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import {DatetimePicker, Button, Toast,Tabbar, TabItem,Navbar,Progress,Popup} from 'mint-ui';
import Mint from 'mint-ui';
import VueResource from 'vue-resource'



Vue.use(Mint);
Vue.use(VueResource)

Vue.component(Tabbar.name, Tabbar);
Vue.component(TabItem.name, TabItem);
Vue.component(Navbar.name, Navbar);
// Vue.component(Toast.name, Toast);
Vue.component(Button.name, Button);
// Vue.use(Toast);
Vue.component(Progress.name, Progress);
Vue.component(Popup.name, Popup);


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
