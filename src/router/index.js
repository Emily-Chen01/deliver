import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/index'
import ManyCompany from "@/components/register/manyCompany"
import signCard from "@/components/register/signCard"
import signIn from "@/components/SignIn/signIn"
import quick from "@/components/register/quick"
import myData from "@/components/staffData/myData"
import leave from "@/components/leaves/leave"
import attendanceRecord from "@/components/SignIn/attendanceRecord"
import mySalary from "@/components/SignIn/mySalary"
import datePick from "@/components/components/datePick"
import set from "@/components/staffData/set"


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',  //快捷打卡和员工绑定
      component: quick
    },
    {
      path: '/index',
      name: 'Index',
      component: Index,
    },
    {
      path: '/ManyCompany',  //多家公司选择
      component: ManyCompany
    },
    {
      path: '/signCard',  //点击公司后进入签到打卡
      component: signCard
    },
    {
      path: '/signIn',  //进入签到打卡
      component: signIn
    },
    {
      path: '/myData',  //完善我的资料
      component: myData
    },
    {
      path: '/leave',  //请假申请
      component: leave
    },
    {
      path: '/attendanceRecord',  //我的考勤
      component: attendanceRecord
    },
    {
      path: '/mySalary',  //我的工资条
      component: mySalary
    },
    {
      path: '/datePick',  //我的datepick
      component: datePick
    },
    {
      path: '/set',  //我的解除绑定
      component: set
    },
  ]
})
