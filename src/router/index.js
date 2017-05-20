import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/index'
import ManyCompany from "@/components/register/manyCompany"
import signCard from "@/components/register/signCard"
import signIn from "@/components/SignIn/signIn"
import quick from "@/components/register/quick"
import myData from "@/components/staffData/myData"
import leave from "@/components/leaves/leave"
import forgetPunch from "@/components/leaves/forgetPunch"
import outsideApply from "@/components/leaves/outsideApply"
import overtimeApply from "@/components/leaves/overtimeApply"
import attendanceRecord from "@/components/SignIn/attendanceRecord"
import overApply from "@/components/leaves/overApply"
import mySalary from "@/components/SignIn/mySalary"
import datePick from "@/components/components/datePick"




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
      path: '/forgetPunch',  //忘记打卡申请
      component: forgetPunch
    },
    {
      path: '/outsideApply',  //外出申请
      component: outsideApply
    },
    {
      path: '/overtimeApply',  //加班申请
      component: overtimeApply
    },
    {
      path: '/attendanceRecord',  //我的考勤
      component: attendanceRecord
    },
    {
      path: '/overApply',  //我的加班申请
      component: overApply
    },
    {
      path: '/mySalary',  //我的工资条
      component: mySalary
    },
    {
      path: '/datePick',  //我的datepick
      component: datePick
    },
  ]
})
