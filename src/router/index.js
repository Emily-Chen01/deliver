import Vue from 'vue'
import Router from 'vue-router'
import home from "@/pages/home"
import resume from "@/pages/resume"
import information from "@/components/information/information"
import attach from "@/components/information/attach"
import success from "@/components/information/success"

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',  //首页
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的        
      },
      component: home
    },
    {
      path: '/resume',  //信息展示页
      component: resume
    },
    {
      path: '/information',  //信息填写页
      component: information
    },
    {
      path: '/attach',  //附件信息
      component: attach
    },
    {
      path: '/success',  //投递成功
      component: success
    }
  ]
})

export default router
