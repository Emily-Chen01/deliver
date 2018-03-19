<template>
  <div id="task_wrapper">
    <full-calendar
      :connectTime="connectTime"
      :events="fcEvents" lang="zh"
      @dayClick="dayClick"
      @changeMonth="changeMonth"
    ></full-calendar>
    <div class="task_moduleBox">
      <div class="task_moduleTitle">2018-3-15 到期任务</div>
      <ul class="task_moduleList">
        <li class="task_moduleList_item" @click="queryTask" v-for="n in 3">
          <div class="task_moduleList_top">
            <span class="task_moduleList_topLeft">日常任务</span>
            <span class="task_moduleList_topRight">朝外大街巡逻</span>
          </div>
          <div class="task_moduleList_bottom">
            <i class="icon_bg_taskImg bg-ico_date"></i>
            <span class="task_moduleList_bottomRight">今日到期</span>
          </div>
        </li>
      </ul>
      <div class="task_noModuleList">暂无已完成任务</div>
    </div>
    <mt-popup
      v-model="popupVisible"
      position="right">
      <div class="addTask_Wrapper">
        <h3 class="feedback_title">反馈内容</h3>
        <mt-button type="primary" size="large" @click="submitTask">发布任务</mt-button>
      </div>
    </mt-popup>
    <div class="task_addBtn">
      <mt-button type="primary" size="large" @click="addTask">添加任务</mt-button>
    </div>
  </div>
</template>

<script>
  import fullCalendar from '@/components/vue-fullcalendar/src/fullCalendar'
  export default {
    data(){
      return {
        popupVisible: false,//判断添加任务弹框是否显示
        fcEvents: [
//                {
//                  title : '',
//                  start : '2017/06/4',
//                  end : '2017/06/4',
//                  cssClass:'normal',
//                  YOUR_DATA  : {}
//                }
        ],
//        punchState: [],//选中日期打卡信息展示
//        oldDayClick: '',//已经选中的日期
//        duration: null,//选中日期当日工时
//        tozhang: '', //上班打卡状态
//        downzhang: '',  //下班打卡状态
        connectTime: {
          chidao: '',   //迟到数量
          zaotui: '',//早退数量
          kuanggong: '',//旷工数量
          waichu: '',//外出数量
          totalTime: '',//今日工时数量
          state: false,//判断是否显示这些数量值
        },
//        toSapnTime: '', // 上班时间
//        downSapnTime: '', // 下班时间
//        imgSrc: {
//          timeIcon: require('../../assets/time.png'),
//        },
      }
    },
    methods: {
      dayClick (day) {
        //  点击日历，获取日期
        //  转换日期格式
        //  检测假日里是否已经含有点击的这一天
        //再此处调用每一次日期的接口 进行传值
        //点击当天进行查询打卡状态开始
        //格式化时间开始
//        if (this.oldDayClick !== moment(day).format(df2)) {
//          this.oldDayClick = moment(day).format(df2);
//          let param = {
//            date: moment(day).format(df2)
//          };
//          this.$http.post('/api/v1.0/client/findDatePunchCardLog', param).then(response => { //点击查看当天考勤
//            if (response.body.code === 200) {
//              this.punchState = response.body.result;
//              this.duration = null;
//              for (let i = 0; i < this.punchState.data.length; i++) {
//                this.duration += this.punchState.data[i].duration;
//              }
//            }
//          }, response => {
//          });
//        }
      },
      changeMonth (start, end, currentStart, current) {
//        let param = {
//          date: moment(new Date(currentStart)).format(df1)
//        };
//        this.$http.post('/api/v1.0/client/findMonthAttends', param).then(response => { //查询当月考勤接口
//          this.fcEvents = [];
//          if (response.body.code === 200) {
//            //显示默认当天考勤信息
//            this.dayClick(new Date());
//            if (response.body.result) {
//              //显示假期信息
//              let arrayShow = response.body.result.attend.holidays;
//              if (arrayShow.length) {
//                for (let i = 0; i < arrayShow.length; i++) {    //此处循环一个数组进行填充假期显示
//                  if (arrayShow[i].rightType === '1' || arrayShow[i].rightType === '2') {
//                    this.fcEvents.push({
//                      isHoliday: true,
//                      start: arrayShow[i].date,
//                      end: arrayShow[i].date,
//                    });
//                  }
//                }
//              }
//              //  改变当月工作日的背景颜色
//              this.showDate(response.body.result.attend.wdSun, 0);
//              this.showDate(response.body.result.attend.wdMon, 1);
//              this.showDate(response.body.result.attend.wdTue, 2);
//              this.showDate(response.body.result.attend.wdWed, 3);
//              this.showDate(response.body.result.attend.wdThu, 4);
//              this.showDate(response.body.result.attend.wdFri, 5);
//              this.showDate(response.body.result.attend.wdSat, 6);
//              if (response.body.result.records.length) {
//                for (let i = 0; i < response.body.result.records.length; i++) { //循环添加给日历表添加日期状态
//                  let connectDate = {};
//                  connectDate.start = response.body.result.records[i].date;
//                  connectDate.end = response.body.result.records[i].date;
//                  connectDate.cssClass = response.body.result.records[i].desc;
//                  this.fcEvents.push(connectDate);
//                }
//              }
//              this.connectTime.chidao = response.body.result.belateTimes;   //赋值给查询出来的月总数
//              this.connectTime.zaotui = response.body.result.leaveearlyTimes;
//              this.connectTime.kuanggong = response.body.result.absentTimes;
//              this.connectTime.waichu = response.body.result.outsideTimes;
//            }
//          }
//        }, response => {
//        });
      },
      // 查看任务详情
      queryTask(){
        this.$router.push({path: '/task_details'});
      },
      // 添加任务
      addTask(){
        this.popupVisible = true;
      },
      // 发布任务
      submitTask(){
        this.popupVisible = false;
      }
    },
    components: {
      fullCalendar
    }
  }
</script>
<style lang="scss">
  #task_wrapper {
    padding-bottom: 65px;
    .task_moduleBox {
      .task_moduleTitle {
        padding: 0 15px;
        height: 40px;
        line-height: 40px;
        font-size: 15px;
        color: #666666;
        text-align: left;
      }
      .task_moduleList {
        list-style-type: none;
        padding: 0 15px;
        text-align: left;
        background-color: #ffffff;
        .task_moduleList_item {
          padding: 15px 0 10px;
          border-bottom: 1px solid rgb(204, 204, 204);
          &:last-child {
            border: none;
          }
          .task_moduleList_top {
            .task_moduleList_topLeft {
              display: inline-block;
              padding: 3px;
              border-radius: 3px;
              font-size: 13px;
              color: #ffffff;
              background-color: #ff9f4a;
            }
            .task_moduleList_topRight {
              font-size: 15px;
              color: #333333;
            }
          }
          .task_moduleList_bottom {
            margin-top: 10px;
            .task_moduleList_bottomRight {
              color: #333333;
              font-size: 13px;
              vertical-align: middle;
            }
          }
        }
      }
      .task_noModuleList {
        height: 40px;
        line-height: 40px;
        font-size: 15px;
        color: #999999;
        background-color: #eff3f7;
      }
    }
    .mint-popup {
      width: 100vw;
      height: 100vh;
    }
    .task_addBtn {
      position: fixed;
      box-sizing: border-box;
      padding: 10px 15px 20px;
      bottom: 0;
      width: 100%;
      background-color: #eff3f7;
    }
  }
</style>
