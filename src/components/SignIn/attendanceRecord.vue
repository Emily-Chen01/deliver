<template>
  <div>
    <full-calendar
      :connectTime="connectTime"
      :events="fcEvents" lang="zh"
      @dayClick="dayClick"
      @changeMonth="changeMonth"
    ></full-calendar>
    <div class="egStates">
      <div class="egClass"><span class="publicStyle normalStyle"></span>正常出勤</div>
      <div class="egClass"><span class="publicStyle abnormalStyle"></span>考勤异常</div>
      <div class="egClass"><span class="publicStyle leaveStyle"></span>请假</div>
      <div class="egClass"><span class="publicStyle holidayStyle"></span>假期</div>
    </div>
    <div style="background:rgb(239,241,247);">
      <div class="timeTitle">
        <div class="todayTime lineStyle">
          <div class="timeDivClass">
            <img :src="imgSrc.timeIcon" class="timeImageClass">
          </div>
          <div class="timeSpanClass">
            <span>今日工时共计:{{(duration !== null) ? duration : ''}}小时</span>
          </div>
        </div>
        <div class="punchInfo" v-for="(punchItem,punchIndex) in punchState.data" :key="punchIndex">
          <div class="punchInfoLeft">
            <div class="punchInfoLine"></div>
            <p class="punchInfoUp"></p>
            <p class="punchInfoDown"></p>
          </div>
          <div class="punchInfoRight">
            <p
              v-text="(punchItem.twTime ? (formatTime(punchItem.twTime)+' ') : '') + formatPunchState(punchItem.twStatus,punchItem.twOutside,punchItem.twTime,punchState.IS_TODAY,true)"></p>
            <p
              v-text="(punchItem.owTime ? (formatTime(punchItem.owTime)+' ') : '') + formatPunchState(punchItem.owStatus,punchItem.owOutside,punchItem.owTime,punchState.IS_TODAY,false)"></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import fullCalendar from '@/components/vue-fullcalendar/src/fullCalendar'
  import moment from 'moment'
  let df = 'HH:mm:ss';
  let df1 = 'YYYY/MM';
  let df2 = 'YYYY/MM/DD';

  export default {
//    abnormal=异常   normal=正常   leave=请假   这个定的值是封装在日历里面定义好的颜色
    data(){
      return {
        fcEvents: [
//                {
//                  title : '',
//                  start : '2017/06/4',
//                  end : '2017/06/4',
//                  cssClass:'normal',
//                  YOUR_DATA  : {}
//                }
        ],
        punchState: [],//选中日期打卡信息展示
        oldDayClick: '',//已经选中的日期
        duration: null,//选中日期当日工时
        tozhang: '', //上班打卡状态
        downzhang: '',  //下班打卡状态
        connectTime: {
          chidao: '',   //迟到数量
          zaotui: '',//早退数量
          kuanggong: '',//旷工数量
          waichu: '',//外出数量
          totalTime: '',//今日工时数量
          state: true,//判断是否显示这些数量值
        },
        toSapnTime: '', // 上班时间
        downSapnTime: '', // 下班时间
        imgSrc: {
          timeIcon: require('../../assets/time.png'),
        },
      }
    },
    created: function () {
      //初始化查询当月考勤省略 由于 changeMonth会执行查询这个月的数据展示
    },
    methods: {
      dayClick (day) {
        //  点击日历，获取日期
        //  转换日期格式
        //  检测假日里是否已经含有点击的这一天
        //再此处调用每一次日期的接口 进行传值
        //点击当天进行查询打卡状态开始
        //格式化时间开始
        if (this.oldDayClick !== moment(day).format(df2)) {
          this.oldDayClick = moment(day).format(df2);
          let param = {
            date: moment(day).format(df2)
          };
          this.$http.post('/api/v1.0/client/findDatePunchCardLog', param).then(response => { //点击查看当天考勤
            if (response.body.code === 200) {
              this.punchState = response.body.result;
              this.duration = null;
              for (let i = 0; i < this.punchState.data.length; i++) {
                this.duration += this.punchState.data[i].duration;
              }
            }
          }, response => {
          });
        }
      },
      changeMonth (start, end, currentStart, current) {
        let param = {
          date: moment(new Date(currentStart)).format(df1)
        };
        this.$http.post('/api/v1.0/client/findMonthAttends', param).then(response => { //查询当月考勤接口
          this.fcEvents = [];
          if (response.body.code === 200) {
            //显示默认当天考勤信息
            this.dayClick(new Date());
            if (response.body.result) {
              //显示假期信息
              let arrayShow = response.body.result.attend.holidays;
              if (arrayShow.length) {
                for (let i = 0; i < arrayShow.length; i++) {    //此处循环一个数组进行填充假期显示
                  if (arrayShow[i].rightType === '1' || arrayShow[i].rightType === '2') {
                    this.fcEvents.push({
                      isHoliday: true,
                      start: arrayShow[i].date,
                      end: arrayShow[i].date,
                    });
                  }
                }
              }
              //  改变当月工作日的背景颜色
              this.showDate(response.body.result.attend.wdSun, 0);
              this.showDate(response.body.result.attend.wdMon, 1);
              this.showDate(response.body.result.attend.wdTue, 2);
              this.showDate(response.body.result.attend.wdWed, 3);
              this.showDate(response.body.result.attend.wdThu, 4);
              this.showDate(response.body.result.attend.wdFri, 5);
              this.showDate(response.body.result.attend.wdSat, 6);
              if (response.body.result.records.length) {
                for (let i = 0; i < response.body.result.records.length; i++) { //循环添加给日历表添加日期状态
                  let connectDate = {};
                  connectDate.start = response.body.result.records[i].date;
                  connectDate.end = response.body.result.records[i].date;
                  connectDate.cssClass = response.body.result.records[i].desc;
                  this.fcEvents.push(connectDate);
                }
              }
              this.connectTime.chidao = response.body.result.belateTimes;   //赋值给查询出来的月总数
              this.connectTime.zaotui = response.body.result.leaveearlyTimes;
              this.connectTime.kuanggong = response.body.result.absentTimes;
              this.connectTime.waichu = response.body.result.outsideTimes;
            }
          }
        }, response => {
        });
      },

      showDate(name, num){ //查出展示当月工作日的背景颜色
        if (!name) {
          let week = document.getElementsByClassName('week-row');
          for (let i = 0; i < week.length; i++) {
            let data = week[i].getElementsByClassName('day-cell');
            if (!data[num].classList.contains("not-cur-month")) {
              data[num].style.color = 'rgb(180,184,187)';
            } else {
              data[num].style.color = '';
            }
          }
        } else {
          let week = document.getElementsByClassName('week-row');
          for (let i = 0; i < week.length; i++) {
            let data = week[i].getElementsByClassName('day-cell');
            if (!data[num].classList.contains("not-cur-month")) {
              data[num].style.color = '';
            } else {
              data[num].style.color = '';
            }
          }
        }
      },
      // 格式化时间
      formatTime(time){
        return moment(new Date(time)).format(df)
      },
      // 格式化打卡状态
      formatPunchState(state, area, time, isToday, type){
        let show = '';
        if (time) {
          if (type) {
            if (state === 0) {
              show = '正常打卡';
            } else if (state === 1) {
              show = '迟到打卡';
            } else if (state === 2) {
              show = '旷工打卡';
            }
          } else {
            if (state === 0) {
              show = '正常打卡';
            } else if (state === 1) {
              show = '早退打卡';
            } else if (state === 2) {
              show = '加班打卡';
            } else if (state === 3) {
              show = '旷工打卡';
            }
          }
          if (area) {
            show = show + '(区域外)';
          }
        } else {
          if (isToday) {
            show = '';
          } else {
            show = '未打卡';
          }
        }
        return show;
      }
    },
    components: {
      fullCalendar
    }
  }
</script>

<style scoped lang="scss">
  .egStates {
    height: 43px;
    background: #ffffff;
    font-size: 0;
    .egClass {
      box-sizing: border-box;
      width: 25%;
      height: 43px;
      line-height: 43px;
      display: inline-block;
      font-size: 12px;
      .publicStyle {
        width: 0.6rem;
        height: 0.6rem;
        margin-right: 6px;
        line-height: 0.6rem;
        border-radius: 50%;
        display: inline-block;
      }
      .normalStyle {
        background: rgb(32, 161, 255);
      }
      .abnormalStyle {
        background: rgb(255, 204, 0);
      }
      .leaveStyle {
        background: rgb(102, 204, 0);
      }
      .holidayStyle {
        background-color: #ff4949;
      }
    }
    .egClass:nth-child(1) {
      padding-left: 15px;
      text-align: left;
    }
    .egClass:nth-child(2) {
      text-align: center;
    }
    .egClass:nth-child(3) {
      padding-right: 15px;
      text-align: right;
    }
  }

  .timeTitle {
    position: relative;
    font-size: 14px;
    color: #1f2d3d;
    text-align: left;
    padding-bottom: 10px;
    .todayTime {
      height: 44px;
      line-height: 44px;
      .timeDivClass {
        margin-top: 14px;
        margin-left: 15px;
        line-height: 16px;
        display: inline-block;
        vertical-align: top;
        .timeImageClass {
          display: block;
          width: 16px;
          height: 16px;
        }
      }
      .timeSpanClass {
        margin-left: 2px;
        margin-top: 14px;
        text-align: left;
        line-height: 16px;
        display: inline-block;
        vertical-align: top;
      }
    }
    .lineStyle {
      border-bottom: 1px solid #cccccc;
    }
    .punchInfo {
      box-sizing: border-box;
      width: 100%;
      padding: 15px 15px;
      overflow: hidden;
      p {
        margin: 0;
      }
      .punchInfoLeft {
        position: relative;
        width: 22px;
        float: left;
        .punchInfoLine {
          margin-left: 10px;
          width: 0;
          height: 59px;
          border-left: 1px solid #9aaabf;
        }
        p {
          position: absolute;
          width: 22px;
          height: 22px;
          border-radius: 50%;
        }
        .punchInfoUp {
          top: 0;
          background: url("../../assets/ico_to.png");
          background-size: 22px 22px;
        }
        .punchInfoDown {
          bottom: 0;
          background: url("../../assets/ico_off.png");
          background-size: 22px 22px;
        }
      }
      .punchInfoRight {
        float: left;
        margin-left: 10px;
        p {
          box-sizing: border-box;
          width: 100%;
          height: 22px;
          line-height: 22px;
          font-size: 14px;
          color: #1f2d3d;
        }
        p:nth-child(2) {
          margin-top: 15px;
        }
      }
    }
  }
</style>
