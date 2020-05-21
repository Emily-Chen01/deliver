// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);
import router from './router'
import VueResource from 'vue-resource'
import './assets/font/iconfont.css'

Vue.use(VueResource);

Vue.http.interceptors.push(function (request, next) {
  // Vue.http.headers.common['token'] = sessionStorage.getItem('token');
  // sessionStorage.setItem('openId', openId);
  // request.headers.set('openId', this.getCookie('openId'));
  // continue to next interceptor
  next(response => {
    if (response.body.code === 4001) {
      // console.log('inter', response.body.message);
      router.push({path: 'index'});
    }else if (response.body.code === 5001) {
      Indicator.close();//关闭加载中
      Toast({
        message: response.body.message,
        iconClass: 'bg-img ico_error'
      });
      setTimeout(function () {
        router.push({path: '/binding'});
      },2000);
    }
  });
});

//弹出框禁止滑动
// Vue.prototype.noScroll = function () {
//     var mo = function (e) { e.preventDefault() }
//     document.body.style.overflow = 'hidden'
//     document.addEventListener('touchmove', mo, false)// 禁止页面滑动
//   }
   
  //弹出框可以滑动
  // Vue.prototype.canScroll = function () {
  //   var mo = function (e) {
  //     e.preventDefault()
  //   }
  //   document.body.style.overflow = ''// 出现滚动条
  //   document.removeEventListener('touchmove', mo, false)
  // }

//cook开始
Vue.prototype.setCookie = function (c_name, value, expiredays) {
  let exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie = c_name + "=" + escape(value) +
    ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
};


//=========取回cookie==========
Vue.prototype.getCookie = function (c_name) {
  var c_start;
  var c_end;

  if (document.cookie.length > 0) {
    c_start = document.cookie.indexOf(c_name + "=")
    if (c_start != -1) {
      c_start = c_start + c_name.length + 1
      c_end = document.cookie.indexOf(";", c_start)
      if (c_end == -1) c_end = document.cookie.length
      return unescape(document.cookie.substring(c_start, c_end))
    }
  }
  return ""
};
//============cook结束==============


Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
});


