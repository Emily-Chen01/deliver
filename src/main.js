// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import {DatetimePicker, Button, Toast,Tabbar, TabItem,Navbar,Progress,Popup,Field,Header ,TabContainer, TabContainerItem,Radio } from 'mint-ui';
import Mint from 'mint-ui';
import VueResource from 'vue-resource'
import fullCalendar from 'vue-fullcalendar'
import 'mint-ui/lib/style.css'

import BaiduMap from 'vue-baidu-map'


Vue.use(Mint);
Vue.use(VueResource);


Vue.component(Tabbar.name, Tabbar);
Vue.component(TabItem.name, TabItem);
Vue.component(Navbar.name, Navbar);
// Vue.component(Toast.name, Toast);
Vue.component(Button.name, Button);
// Vue.use(Toast);
Vue.component(Progress.name, Progress);
Vue.component(Popup.name, Popup);
Vue.component(Field.name, Field);
Vue.component(DatetimePicker.name, DatetimePicker);
Vue.component('full-calendar', fullCalendar);
Vue.component(Header.name, Header);
Vue.component(TabContainer.name, TabContainer);
Vue.component(TabContainerItem.name, TabContainerItem);
Vue.component(Radio .name, Radio );


Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'YOUR_APP_KEY'
})






// let ff=JSON.parse(sessionStorage.obj);
// console.log(ff.openIDD);
// let openId=ff.openIDD;
Vue.http.interceptors.push(function (request, next) {
  // Vue.http.headers.common['token'] = sessionStorage.getItem('token');
  // sessionStorage.setItem('openId', openId);
  console.log('openId', sessionStorage.getItem('openId'));
  request.headers.set('openId', sessionStorage.getItem('openId'));



  // continue to next interceptor
  next(response => {
    if (response.body.code === 4001) {
      // console.log('inter', response.body.message);
      router.push({path: 'index'});
    }
  });
});





Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
