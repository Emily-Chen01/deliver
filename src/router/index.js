import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/index'
import ManyCompany from "@/components/register/manyCompany"
import signCard from "@/components/register/signCard"
import signIn from "@/components/SignIn/signIn"
import quick from "@/components/register/quick"
import myData from "@/components/staffData/myData"
import leave from "@/components/leaves/leave"
import notice from "@/components/notice/notice"
import noticeDetails from "@/components/notice/details"
import attendanceRecord from "@/components/SignIn/attendanceRecord"
import mySalary from "@/components/SignIn/mySalary"
import binding from "@/components/binding/binding"
import task from "@/components/task/task"
import taskDetails from "@/components/task/details"


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
      path: '/binding',  //多家公司选择
      component: binding
    },
    {
      path: '/task',  //我的任务
      component: task
    },
    {
      path: '/task_details',  //我的任务
      component: taskDetails
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
      path: '/notice',  //公告列表页
      component: notice
    },
    {
      path: '/notice_details',  //公告详情页
      component: noticeDetails
    }
  ]
})
